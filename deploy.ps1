$ErrorActionPreference = "Stop"

$PROJECT_ID = gcloud config get-value project
$REGION = "us-central1"

Write-Host "Building Server Image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/momotombo-server -f apps/server/Dockerfile .

Write-Host "Deploying Server to Cloud Run..."
gcloud run deploy server `
    --image gcr.io/$PROJECT_ID/momotombo-server `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --port 3001

Write-Host "Building Client Image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/momotombo-client -f apps/client/Dockerfile .

Write-Host "Deploying Client to Cloud Run..."
gcloud run deploy client `
    --image gcr.io/$PROJECT_ID/momotombo-client `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --port 3000

Write-Host "Deploy completo!"
