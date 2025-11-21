#!/bin/bash

# Setup Cloud Build Triggers via CLI
# DevFest PTA 2025

set -e

PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
REPO_OWNER="kevin-naicker-dvt"
REPO_NAME="devfest-pta-2025"

echo "🔧 Setting up Cloud Build Triggers..."
echo ""
echo "Project: $PROJECT_ID"
echo "Repository: $REPO_OWNER/$REPO_NAME"
echo ""

# Note: First connection must be done via console
echo "⚠️  IMPORTANT: First-time setup"
echo ""
echo "If you haven't connected your GitHub repository yet:"
echo "  1. Go to: https://console.cloud.google.com/cloud-build/triggers"
echo "  2. Click 'Connect Repository'"
echo "  3. Select 'GitHub (Cloud Build GitHub App)'"
echo "  4. Authenticate and select: $REPO_OWNER/$REPO_NAME"
echo "  5. Then run this script"
echo ""
read -p "Have you connected the repository? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please connect the repository first, then run this script again."
    exit 1
fi

echo ""
echo "Creating triggers..."
echo ""

# 1. Migration Trigger (Manual only)
echo "1/3 Creating migration trigger (manual)..."
gcloud builds triggers create manual \
    --name="migrate-database" \
    --description="Run database migrations on Cloud SQL" \
    --repo="https://github.com/$REPO_OWNER/$REPO_NAME" \
    --repo-type="GITHUB" \
    --branch="main" \
    --build-config="cloudbuild-migrate.yaml" \
    --substitutions="_REGION=$REGION,_INSTANCE_CONNECTION_NAME=$PROJECT_ID:$REGION:devfest-postgres,_DB_NAME=devfest_db,_DB_USER=devfest_user" \
    2>/dev/null || echo "  (Trigger may already exist, skipping...)"

echo "  ✅ Migration trigger created"
echo ""

# 2. Backend Trigger (Auto on push)
echo "2/3 Creating backend trigger (auto-deploy)..."
gcloud builds triggers create github \
    --name="backend-deploy" \
    --description="Build and deploy backend API to Cloud Run" \
    --repo-name="$REPO_NAME" \
    --repo-owner="$REPO_OWNER" \
    --branch-pattern="^main$" \
    --build-config="cloudbuild-backend.yaml" \
    --included-files="backend/**,cloudbuild-backend.yaml" \
    --substitutions="_REGION=$REGION,_SERVICE_NAME=devfest-backend,_INSTANCE_CONNECTION_NAME=$PROJECT_ID:$REGION:devfest-postgres,_DB_NAME=devfest_db,_DB_USER=devfest_user" \
    2>/dev/null || echo "  (Trigger may already exist, skipping...)"

echo "  ✅ Backend trigger created"
echo ""

# 3. Frontend Trigger (Auto on push)
echo "3/3 Creating frontend trigger (auto-deploy)..."
gcloud builds triggers create github \
    --name="frontend-deploy" \
    --description="Build and deploy frontend to Cloud Run" \
    --repo-name="$REPO_NAME" \
    --repo-owner="$REPO_OWNER" \
    --branch-pattern="^main$" \
    --build-config="cloudbuild-frontend.yaml" \
    --included-files="frontend/**,cloudbuild-frontend.yaml" \
    --substitutions="_REGION=$REGION,_SERVICE_NAME=devfest-frontend" \
    2>/dev/null || echo "  (Trigger may already exist, skipping...)"

echo "  ✅ Frontend trigger created"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All triggers created successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 View your triggers:"
echo "   https://console.cloud.google.com/cloud-build/triggers?project=$PROJECT_ID"
echo ""
echo "📝 List triggers via CLI:"
echo "   gcloud builds triggers list"
echo ""
echo "🚀 Next steps:"
echo "   1. Run migration manually: gcloud builds triggers run migrate-database --branch=main"
echo "   2. Make a change to backend or frontend"
echo "   3. Push to main branch"
echo "   4. Watch auto-deployment happen!"
echo ""

