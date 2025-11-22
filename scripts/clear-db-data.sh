#!/bin/bash
# Clear Database Data - Keep structure, remove all records
# This is useful for resetting demo data

set -e

echo "=================================================="
echo "Clear Database Data (Keep Structure)"
echo "=================================================="
echo ""
echo "This will DELETE all data from tables but keep the structure."
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
echo "Clearing data from tables..."

# Clear applications table
echo "1. Clearing applications table..."
PGPASSWORD='DevF3st123-pluto-is-plan3t' psql \
  -h $DB_IP \
  -p 5432 \
  -U devfest_user \
  -d devfest_db \
  -c "DELETE FROM applications;"

# Clear hello_world table
echo "2. Clearing hello_world table..."
PGPASSWORD='DevF3st123-pluto-is-plan3t' psql \
  -h $DB_IP \
  -p 5432 \
  -U devfest_user \
  -d devfest_db \
  -c "DELETE FROM hello_world;"

echo ""
echo "✅ Database data cleared!"
echo ""
echo "To reload sample data, run the migrations:"
echo "  git commit --allow-empty -m 'Reload migrations'"
echo "  git push origin main"
echo ""

