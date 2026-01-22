# Skrypt uruchamiający backend i frontend jednocześnie

Write-Host "🚀 Uruchamianie aplikacji Blur Background..." -ForegroundColor Green
Write-Host ""

# Zmień katalog na główny folder projektu
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Uruchom concurrently
npm start
