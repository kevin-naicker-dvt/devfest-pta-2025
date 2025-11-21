#!/bin/bash

# Setup Cloud Build Service Account Permissions
# DevFest PTA 2025

set -e

# Get project information
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo "🔐 Setting up service account permissions..."
echo ""
echo "Project ID: $PROJECT_ID"
echo "Project Number: $PROJECT_NUMBER"
echo "Cloud Build SA: $BUILD_SA"
echo "Compute SA: $COMPUTE_SA"
echo ""

# Grant roles to Cloud Build service account
echo "Granting roles to Cloud Build service account..."

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${BUILD_SA}" \
    --role="roles/cloudsql.client" \
    --condition=None

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${BUILD_SA}" \
    --role="roles/run.admin" \
    --condition=None

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${BUILD_SA}" \
    --role="roles/iam.serviceAccountUser" \
    --condition=None

# Grant Secret Manager access (if secrets exist)
echo ""
echo "Granting Secret Manager access..."

# Check if db-password secret exists
if gcloud secrets describe db-password &>/dev/null; then
    gcloud secrets add-iam-policy-binding db-password \
        --member="serviceAccount:${BUILD_SA}" \
        --role="roles/secretmanager.secretAccessor"
    
    gcloud secrets add-iam-policy-binding db-password \
        --member="serviceAccount:${COMPUTE_SA}" \
        --role="roles/secretmanager.secretAccessor"
    
    echo "  ✓ Secret access granted"
else
    echo "  ⚠ db-password secret not found (will be created later)"
fi

echo ""
echo "✅ Permissions configured successfully!"
echo ""
echo "Service accounts now have:"
echo "  ✓ Cloud SQL Client access"
echo "  ✓ Cloud Run Admin access"
echo "  ✓ Service Account User access"
echo "  ✓ Secret Manager access (if secrets exist)"

