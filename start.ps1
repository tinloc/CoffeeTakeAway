# =============================================
# Coffee TakeAway - Script khởi động server
# Chạy: click chuột phải → "Run with PowerShell"
# Hoặc trong terminal: .\start.ps1
# =============================================

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "   Coffee TakeAway - Dev Server" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra thư mục BE tồn tại không
$beDir = Join-Path $PSScriptRoot "BE"
if (-not (Test-Path $beDir)) {
    Write-Host "[ERROR] Không tìm thấy thư mục BE!" -ForegroundColor Red
    Read-Host "Nhấn Enter để thoát"
    exit 1
}

# Tự động kill process đang chiếm port 3000
Write-Host "[1/3] Kiểm tra port 3000..." -ForegroundColor Yellow
$portProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portProcess) {
    $pid3000 = $portProcess.OwningProcess | Select-Object -First 1
    Write-Host "     → Port 3000 đang bị chiếm (PID $pid3000). Đang tắt..." -ForegroundColor DarkYellow
    Stop-Process -Id $pid3000 -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 800
    Write-Host "     → Đã giải phóng port 3000." -ForegroundColor Green
} else {
    Write-Host "     → Port 3000 trống. OK." -ForegroundColor Green
}

# Kiểm tra node_modules
Write-Host "[2/3] Kiểm tra dependencies..." -ForegroundColor Yellow
$nodeModules = Join-Path $beDir "node_modules"
if (-not (Test-Path $nodeModules)) {
    Write-Host "     → Chưa có node_modules. Đang cài đặt..." -ForegroundColor DarkYellow
    Set-Location $beDir
    npm install
}
Write-Host "     → Dependencies OK." -ForegroundColor Green

# Khởi động server
Write-Host "[3/3] Khởi động server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Truy cập: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Dừng server: Ctrl + C" -ForegroundColor DarkGray
Write-Host ""

Set-Location $beDir
npm run dev
