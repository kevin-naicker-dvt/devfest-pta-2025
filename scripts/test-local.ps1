# PowerShell script to test local Docker setup
# Run from project root: .\scripts\test-local.ps1

Write-Host "🧪 DevFest PTA 2025 - Local Setup Test Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "1. Checking Docker status..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "   ✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
Write-Host ""
Write-Host "2. Checking environment file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ .env file not found. Creating from example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "   ✅ Created .env from .env.example" -ForegroundColor Green
    } else {
        Write-Host "   ❌ .env.example not found. Please create .env manually." -ForegroundColor Red
        exit 1
    }
}

# Check if required ports are available
Write-Host ""
Write-Host "3. Checking port availability..." -ForegroundColor Yellow

$ports = @(3000, 3001, 5432)
$portsInUse = @()

foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        $portsInUse += $port
        Write-Host "   ⚠️  Port $port is in use" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ Port $port is available" -ForegroundColor Green
    }
}

if ($portsInUse.Count -gt 0) {
    Write-Host ""
    Write-Host "   Warning: Ports $($portsInUse -join ', ') are in use." -ForegroundColor Yellow
    Write-Host "   Docker containers may fail to start." -ForegroundColor Yellow
    $response = Read-Host "   Do you want to continue? (y/n)"
    if ($response -ne "y") {
        exit 1
    }
}

# Start Docker Compose
Write-Host ""
Write-Host "4. Starting Docker containers..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes on first run..." -ForegroundColor Cyan

docker-compose -f docker/docker-compose.local.yml up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Docker containers started successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to start Docker containers" -ForegroundColor Red
    exit 1
}

# Wait for services to be ready
Write-Host ""
Write-Host "5. Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check backend health
Write-Host ""
Write-Host "6. Testing backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Backend API is healthy" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Backend returned status code: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Backend API is not responding" -ForegroundColor Red
    Write-Host "   Check logs: docker-compose -f docker/docker-compose.local.yml logs backend" -ForegroundColor Yellow
}

# Check frontend
Write-Host ""
Write-Host "7. Testing frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend is accessible" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Frontend returned status code: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Frontend is not responding" -ForegroundColor Red
    Write-Host "   Check logs: docker-compose -f docker/docker-compose.local.yml logs frontend" -ForegroundColor Yellow
}

# Check database
Write-Host ""
Write-Host "8. Testing database connection..." -ForegroundColor Yellow
$dbTest = docker exec devfest-postgres-local psql -U devfest_user -d devfest_db -c "SELECT COUNT(*) FROM hello_world;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Database is accessible and hello_world table exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ Database connection failed" -ForegroundColor Red
    Write-Host "   Check logs: docker-compose -f docker/docker-compose.local.yml logs postgres" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "✅ Setup Test Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Access your application:" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:   http://localhost:3001/api/health" -ForegroundColor White
Write-Host "  Database:  localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs:  docker-compose -f docker/docker-compose.local.yml logs -f" -ForegroundColor White
Write-Host "  Stop:       docker-compose -f docker/docker-compose.local.yml down" -ForegroundColor White
Write-Host "  Restart:    docker-compose -f docker/docker-compose.local.yml restart" -ForegroundColor White
Write-Host "=============================================" -ForegroundColor Cyan

