#!/bin/bash
# Reset Database - Drop and recreate tables with sample data
# This runs the migration scripts again

set -e

echo "=================================================="
echo "Reset Database - Drop & Recreate Tables"
echo "=================================================="
echo ""
echo "This will DROP all tables and recreate them with sample data."
echo ""
echo "Database: devfest_db"
echo "Instance: devfest-db-instance"
echo ""
read -p "Are you sure? (type 'yes' to continue): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Getting CloudSQL public IP..."
DB_IP=$(gcloud sql instances describe devfest-db-instance --format='value(ipAddresses[0].ipAddress)')
echo "Database IP: $DB_IP"

echo ""
echo "Dropping tables..."

PGPASSWORD='DevF3st123-pluto-is-plan3t' psql \
  -h $DB_IP \
  -p 5432 \
  -U devfest_user \
  -d devfest_db \
  -c "DROP TABLE IF EXISTS applications CASCADE;"

PGPASSWORD='DevF3st123-pluto-is-plan3t' psql \
  -h $DB_IP \
  -p 5432 \
  -U devfest_user \
  -d devfest_db \
  -c "DROP TABLE IF EXISTS hello_world CASCADE;"

echo ""
echo "✅ Tables dropped!"
echo ""
echo "Running migrations to recreate tables..."

# Run migration files
for migration_file in database/migrations/*.sql; do
  echo "Applying: $migration_file"
  PGPASSWORD='DevF3st123-pluto-is-plan3t' psql \
    -h $DB_IP \
    -p 5432 \
    -U devfest_user \
    -d devfest_db \
    -f "$migration_file"
done

echo ""
echo "✅ Database reset complete!"
echo ""
echo "Verifying tables..."
PGPASSWORD='DevF3st123-pluto-is-plan3t' psql \
  -h $DB_IP \
  -p 5432 \
  -U devfest_user \
  -d devfest_db \
  -c "\dt" \
  -c "SELECT COUNT(*) as applications_count FROM applications;" \
  -c "SELECT COUNT(*) as hello_world_count FROM hello_world;"

echo ""
echo "Database reset successful!"

