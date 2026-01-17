#!/bin/bash
# Script para setup automático de BD local

echo "=== Setup BD API Paraguay ==="
echo ""

read -p "Ingresa usuario PostgreSQL [postgres]: " PGUSER
PGUSER=${PGUSER:-postgres}

read -sp "Ingresa contraseña PostgreSQL: " PGPASSWORD
echo ""

read -p "Ingresa nombre de BD [api_paraguay]: " PGDATABASE
PGDATABASE=${PGDATABASE:-api_paraguay}

read -p "Ingresa host PostgreSQL [localhost]: " PGHOST
PGHOST=${PGHOST:-localhost}

read -p "Ingresa puerto PostgreSQL [5432]: " PGPORT
PGPORT=${PGPORT:-5432}

# Crear BD
echo ""
echo "Creando BD '$PGDATABASE'..."
PGPASSWORD=$PGPASSWORD psql -h $PGHOST -p $PGPORT -U $PGUSER -tc "SELECT 1 FROM pg_database WHERE datname = '$PGDATABASE'" | grep -q 1 || \
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -p $PGPORT -U $PGUSER -c "CREATE DATABASE $PGDATABASE"

# Ejecutar scripts
echo "Ejecutando create_tables.sql..."
PGPASSWORD=$PGPASSWORD psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f sql/create_tables.sql

echo "Ejecutando seed.sql..."
PGPASSWORD=$PGPASSWORD psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f sql/seed.sql

echo ""
echo "✅ BD creada y poblada exitosamente"
echo ""
echo "Actualiza el archivo .env con:"
echo "PGUSER=$PGUSER"
echo "PGPASSWORD=$PGPASSWORD"
echo "PGDATABASE=$PGDATABASE"
echo "PGHOST=$PGHOST"
echo "PGPORT=$PGPORT"
