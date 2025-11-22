#!/bin/bash
# Delete Everything - Complete cleanup for demo
# WARNING: This deletes ALL resources and is irreversible!

set -e

echo "=================================================="
echo "⚠️  DELETE EVERYTHING - COMPLETE CLEANUP ⚠️"
echo "=================================================="
echo ""
echo "This will DELETE:"
echo "  ❌ Cloud Run Frontend service"
echo "  ❌ Cloud Run Backend service"
echo "  ❌ CloudSQL instance (including all data)"
echo "  ❌ Container images"
echo ""
echo "⚠️  THIS IS IRREVERSIBLE! ⚠️"
echo ""
read -p "Are you ABSOLUTELY sure? (type 'DELETE' to continue): " confirm

if [ "$confirm" != "DELETE" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Starting cleanup..."
echo ""

# Delete Cloud Run services
echo "1. Deleting Cloud Run services..."
gcloud run services delete devfest-backend --region=africa-south1 --quiet 2>/dev/null || echo "  Backend service not found or already deleted"
gcloud run services delete devfest-frontend --region=africa-south1 --quiet 2>/dev/null || echo "  Frontend service not found or already deleted"
echo "  ✓ Cloud Run services deleted"

# Delete CloudSQL instance
echo ""
echo "2. Deleting CloudSQL instance (this may take a few minutes)..."
gcloud sql instances delete devfest-db-instance --quiet 2>/dev/null || echo "  CloudSQL instance not found or already deleted"
echo "  ✓ CloudSQL instance deleted"

# Delete container images
echo ""
echo "3. Deleting container images..."
gcloud container images delete gcr.io/dvt-lab-devfest-2025/devfest-backend --quiet 2>/dev/null || echo "  Backend image not found or already deleted"
gcloud container images delete gcr.io/dvt-lab-devfest-2025/devfest-frontend --quiet 2>/dev/null || echo "  Frontend image not found or already deleted"
echo "  ✓ Container images deleted"

echo ""
echo "=================================================="
echo "✅ Complete cleanup finished!"
echo "=================================================="
echo ""
echo "All resources have been deleted."
echo "Monthly cost: $0"
echo ""
echo "To redeploy:"
echo "  1. Run the db-setup-manual Cloud Build trigger"
echo "  2. git push origin main"
echo ""

