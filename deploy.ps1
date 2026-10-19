#Requires -Version 5.0
<#
.SYNOPSIS
    Deploys Momotombo Travels to Google Cloud Run.

.DESCRIPTION
    Mirrors .github/workflows/deploy.yml in behavior. Keep the two in sync:
      - Builds and pushes gcr.io/<project>/momotombo-client and momotombo-server
        images tagged with the current git SHA and "latest".
      - Deploys Cloud Run services momotombo-client (port 3000) and
        momotombo-server (port 3001) in us-central1.
      - Server secrets come from Google Secret Manager via --set-secrets
        (secret values are never printed or stored in revision metadata).
      - Creates or updates the momotombo-migrate Cloud Run job and executes it
        with --wait. The job runs "prisma migrate deploy" from the server image.
        A failed migration fails the deploy.

    NEXT_PUBLIC_* values are build-time inlined by Next.js. Provide them as
    environment variables: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID, NEXT_PUBLIC_SITE_URL.

.NOTES
    Requires: gcloud (authenticated), docker, git. PowerShell 5 compatible.
#>

$ErrorActionPreference = "Stop"

$REGION        = "us-central1"
$CLIENT_SERVICE = "momotombo-client"
$SERVER_SERVICE = "momotombo-server"
$MIGRATE_JOB   = "momotombo-migrate"

function Assert-LastExitCode([string]$Step) {
    if ($LASTEXITCODE -ne 0) {
        throw "$Step failed (exit code $LASTEXITCODE)"
    }
}

# --- Resolve project ID: env GCP_PROJECT_ID or current gcloud config ---
if ($env:GCP_PROJECT_ID) {
    $PROJECT_ID = "$($env:GCP_PROJECT_ID)".Trim()
} else {
    $prevEap = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $PROJECT_ID = (gcloud config get-value project 2>$null | Select-Object -Last 1)
    $ErrorActionPreference = $prevEap
    if ($PROJECT_ID) { $PROJECT_ID = "$PROJECT_ID".Trim() }
}
if (-not $PROJECT_ID) {
    throw "No GCP project found. Set GCP_PROJECT_ID or run: gcloud config set project <id>"
}

# --- Image tag: current git commit (falls back to a timestamp) ---
$prevEap = $ErrorActionPreference
$ErrorActionPreference = "Continue"
$SHA = (git rev-parse HEAD 2>$null | Select-Object -Last 1)
$ErrorActionPreference = $prevEap
if ($SHA) {
    $SHA = "$SHA".Trim()
} else {
    $SHA = (Get-Date -Format "yyyyMMddHHmmss")
}

$CLIENT_IMAGE = "gcr.io/$PROJECT_ID/momotombo-client"
$SERVER_IMAGE = "gcr.io/$PROJECT_ID/momotombo-server"

Write-Host "=== Momotombo Travels - Deploy ===" -ForegroundColor Cyan
Write-Host "Project : $PROJECT_ID"
Write-Host "Region  : $REGION"
Write-Host "Image tag: $SHA"

# --- NEXT_PUBLIC_* are inlined at build time; read from env, never printed ---
$ClientBuildArgs = @()
foreach ($name in @("NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID", "NEXT_PUBLIC_SITE_URL")) {
    $value = [Environment]::GetEnvironmentVariable($name)
    if (-not $value) {
        Write-Warning "Environment variable $name is not set; building client without it."
        $value = ""
    }
    $ClientBuildArgs += @("--build-arg", "$name=$value")
}

Write-Host "`n[1/6] Configuring Docker for GCR..." -ForegroundColor Yellow
gcloud auth configure-docker
Assert-LastExitCode "gcloud auth configure-docker"

Write-Host "`n[2/6] Building and pushing client image..." -ForegroundColor Yellow
docker build @ClientBuildArgs -t "${CLIENT_IMAGE}:$SHA" -t "${CLIENT_IMAGE}:latest" -f apps/client/Dockerfile .
Assert-LastExitCode "docker build (client)"
docker push "${CLIENT_IMAGE}:$SHA"
Assert-LastExitCode "docker push (client, sha)"
docker push "${CLIENT_IMAGE}:latest"
Assert-LastExitCode "docker push (client, latest)"

Write-Host "`n[3/6] Building and pushing server image..." -ForegroundColor Yellow
docker build -t "${SERVER_IMAGE}:$SHA" -t "${SERVER_IMAGE}:latest" -f apps/server/Dockerfile .
Assert-LastExitCode "docker build (server)"
docker push "${SERVER_IMAGE}:$SHA"
Assert-LastExitCode "docker push (server, sha)"
docker push "${SERVER_IMAGE}:latest"
Assert-LastExitCode "docker push (server, latest)"

Write-Host "`n[4/6] Deploying $CLIENT_SERVICE to Cloud Run (port 3000)..." -ForegroundColor Yellow
gcloud run deploy $CLIENT_SERVICE `
    --image "${CLIENT_IMAGE}:$SHA" `
    --region $REGION `
    --platform managed `
    --allow-unauthenticated `
    --port 3000 `
    --memory 512Mi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 10
Assert-LastExitCode "gcloud run deploy ($CLIENT_SERVICE)"

# Secrets live in Google Secret Manager (never in revision metadata).
# Required secret names: DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY,
# STRIPE_WEBHOOK_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GEMINI_API_KEY,
# PINECONE_API_KEY, SENTRY_DSN_SERVER
Write-Host "`n[5/6] Deploying $SERVER_SERVICE to Cloud Run (port 3001)..." -ForegroundColor Yellow
gcloud run deploy $SERVER_SERVICE `
    --image "${SERVER_IMAGE}:$SHA" `
    --region $REGION `
    --platform managed `
    --allow-unauthenticated `
    --port 3001 `
    --set-env-vars "NODE_ENV=production" `
    --set-secrets "DATABASE_URL=DATABASE_URL:latest" `
    --set-secrets "JWT_SECRET=JWT_SECRET:latest" `
    --set-secrets "STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest" `
    --set-secrets "STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest" `
    --set-secrets "GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID:latest" `
    --set-secrets "GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET:latest" `
    --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest" `
    --set-secrets "PINECONE_API_KEY=PINECONE_API_KEY:latest" `
    --set-secrets "SENTRY_DSN=SENTRY_DSN_SERVER:latest" `
    --memory 1Gi `
    --cpu 2 `
    --min-instances 1 `
    --max-instances 20 `
    --timeout 60
Assert-LastExitCode "gcloud run deploy ($SERVER_SERVICE)"

# Idempotent: create the migrate job once, then point it at the fresh image.
# The job runs `prisma migrate deploy` from the server image (prisma CLI ships in deps).
Write-Host "`n[6/6] Running database migrations via $MIGRATE_JOB..." -ForegroundColor Yellow
$prevEap = $ErrorActionPreference
$ErrorActionPreference = "Continue"
gcloud run jobs describe $MIGRATE_JOB --region $REGION 2>&1 | Out-Null
$JobExists = ($LASTEXITCODE -eq 0)
$ErrorActionPreference = $prevEap
if ($JobExists) {
    $JobAction = "update"
} else {
    $JobAction = "create"
}
Write-Host "gcloud run jobs $JobAction $MIGRATE_JOB"
gcloud run jobs $JobAction $MIGRATE_JOB `
    --image "${SERVER_IMAGE}:$SHA" `
    --region $REGION `
    --command "npx" `
    --args "prisma,migrate,deploy" `
    --set-secrets "DATABASE_URL=DATABASE_URL:latest" `
    --max-retries 0 `
    --task-timeout 300
Assert-LastExitCode "gcloud run jobs $JobAction ($MIGRATE_JOB)"

# No error suppression: a failed migration must fail the deploy.
gcloud run jobs execute $MIGRATE_JOB --region $REGION --wait
Assert-LastExitCode "gcloud run jobs execute ($MIGRATE_JOB)"

Write-Host "`nDeploy complete!" -ForegroundColor Green
Write-Host "Client service: $CLIENT_SERVICE"
Write-Host "Server service: $SERVER_SERVICE"
exit 0
