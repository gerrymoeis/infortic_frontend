# Auto-deploy script for Cloudflare Workers
# Run this after git push: .\deploy-after-push.ps1

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🚀 Deploying to Cloudflare Workers..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Run deployment
npm run deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host ""
    exit 1
}
