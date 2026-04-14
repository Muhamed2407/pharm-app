Write-Host "PharmApp іске қосу..." -ForegroundColor Cyan
if (-not (Test-Path "server\.env")) {
  Copy-Item "server\.env.example" "server\.env"
  Write-Host "server/.env жасалды" -ForegroundColor Yellow
}
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000/api/health" -ForegroundColor Green
Write-Host "PostgreSQL керек (орнату: winget install -e --id PostgreSQL.PostgreSQL)" -ForegroundColor Yellow
npm run dev
