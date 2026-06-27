$ErrorActionPreference = "Stop"

Write-Host "=== Momotombo Travels - Start Script ===" -ForegroundColor Cyan

# 1. Check Docker
Write-Host "`n[1/5] Checking Docker..." -ForegroundColor Yellow
try {
    $null = docker info 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Docker not running" }
    Write-Host "Docker is running" -ForegroundColor Green
} catch {
    Write-Host "Error: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# 2. Start PostgreSQL
Write-Host "`n[2/5] Starting PostgreSQL..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to start PostgreSQL" -ForegroundColor Red
    exit 1
}
Write-Host "PostgreSQL container started" -ForegroundColor Green

# 3. Wait for database
Write-Host "`n[3/5] Waiting for database to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
do {
    $attempt++
    Start-Sleep -Seconds 1
    $result = docker exec momotombo_db pg_isready -U momotombo 2>&1
    $ready = $result -match "accepting connections"
    if (-not $ready -and $attempt -le $maxAttempts) {
        Write-Host "." -NoNewline
    }
} while (-not $ready -and $attempt -le $maxAttempts)

if (-not $ready) {
    Write-Host "`nError: Database did not become ready in time" -ForegroundColor Red
    exit 1
}
Write-Host "`nDatabase is ready" -ForegroundColor Green

# 4. Run migrations
Write-Host "`n[4/5] Running database migrations..." -ForegroundColor Yellow
Set-Location apps/server
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Migrations failed" -ForegroundColor Red
    exit 1
}
Write-Host "Migrations completed" -ForegroundColor Green

# 5. Optional seed
if ($args -contains "--seed") {
    Write-Host "`n[+] Seeding database..." -ForegroundColor Yellow
    npx prisma db seed
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Warning: Seed failed" -ForegroundColor Yellow
    } else {
        Write-Host "Seed completed" -ForegroundColor Green
    }
}

# 6. Start server
Write-Host "`n[5/5] Starting server..." -ForegroundColor Yellow
Write-Host "`nServer will be available at http://localhost:3001" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Gray
npm run start:dev
