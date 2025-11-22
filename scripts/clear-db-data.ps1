# PowerShell version - Clear Database Data
# Keep structure, remove all records

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Clear Database Data (Keep Structure)" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will DELETE all data from tables but keep the structure." -ForegroundColor Yellow
Write-Host ""
Write-Host "Database: devfest_db"
Write-Host "Instance: devfest-db-instance"
Write-Host ""

$confirm = Read-Host "Are you sure? (type 'yes' to continue)"

if ($confirm -ne "yes") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "Getting CloudSQL public IP..." -ForegroundColor Green
$DB_IP = gcloud sql instances describe devfest-db-instance --format='value(ipAddresses[0].ipAddress)'
Write-Host "Database IP: $DB_IP"

Write-Host ""
Write-Host "Clearing data from tables..." -ForegroundColor Green

# Set password environment variable
$env:PGPASSWORD = 'DevF3st123-pluto-is-plan3t'

# Clear applications table
Write-Host "1. Clearing applications table..."
psql -h $DB_IP -p 5432 -U devfest_user -d devfest_db -c "DELETE FROM applications;"

# Clear hello_world table
Write-Host "2. Clearing hello_world table..."
psql -h $DB_IP -p 5432 -U devfest_user -d devfest_db -c "DELETE FROM hello_world;"

Write-Host ""
Write-Host "✅ Database data cleared!" -ForegroundColor Green
Write-Host ""
Write-Host "To reload sample data, run the migrations:"
Write-Host "  git commit --allow-empty -m 'Reload migrations'"
Write-Host "  git push origin main"
Write-Host ""

