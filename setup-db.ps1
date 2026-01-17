# Script para setup automático de BD local en Windows

Write-Host "=== Setup BD API Paraguay ===" -ForegroundColor Green
Write-Host ""

$PGUSER = Read-Host "Ingresa usuario PostgreSQL [postgres]"
if (-not $PGUSER) { $PGUSER = "postgres" }

$PGPASSWORD = Read-Host "Ingresa contraseña PostgreSQL" -AsSecureString
$PGPASSWORD = [System.Net.NetworkCredential]::new('', $PGPASSWORD).Password

$PGDATABASE = Read-Host "Ingresa nombre de BD [api_paraguay]"
if (-not $PGDATABASE) { $PGDATABASE = "api_paraguay" }

$PGHOST = Read-Host "Ingresa host PostgreSQL [localhost]"
if (-not $PGHOST) { $PGHOST = "localhost" }

$PGPORT = Read-Host "Ingresa puerto PostgreSQL [5432]"
if (-not $PGPORT) { $PGPORT = "5432" }

# Crear BD
Write-Host ""
Write-Host "Creando BD '$PGDATABASE'..." -ForegroundColor Yellow
$env:PGPASSWORD = $PGPASSWORD
psql -h $PGHOST -p $PGPORT -U $PGUSER -c "CREATE DATABASE $PGDATABASE" 2>$null

# Ejecutar scripts
Write-Host "Ejecutando create_tables.sql..." -ForegroundColor Yellow
psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f "sql/create_tables.sql"

Write-Host "Ejecutando seed.sql..." -ForegroundColor Yellow
psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f "sql/seed.sql"

Write-Host ""
Write-Host "✅ BD creada y poblada exitosamente" -ForegroundColor Green
Write-Host ""
Write-Host "Actualiza el archivo .env con:" -ForegroundColor Cyan
Write-Host "PGUSER=$PGUSER"
Write-Host "PGPASSWORD=$PGPASSWORD"
Write-Host "PGDATABASE=$PGDATABASE"
Write-Host "PGHOST=$PGHOST"
Write-Host "PGPORT=$PGPORT"
Write-Host ""
Write-Host "Luego ejecuta: npm run dev" -ForegroundColor Green
