#!/bin/bash

# Complete Deployment Script
# DevFest PTA 2025
# This script deploys migrations, backend, and frontend in sequence

set -e

REGION="us-central1"
PROJECT_ID=$(gcloud config get-value project)

echo "🚀 DevFest PTA 2025 - Complete Deployment"
echo "=========================================="
echo ""
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Step 1: Run migrations
echo "📊 Step 1/3: Running database migrations..."
echo "============================================"
gcloud builds submit \
    --config=cloudbuild-migrate.yaml \
    --substitutions=_INSTANCE_CONNECTION_NAME="$PROJECT_ID:$REGION:devfest-postgres"

echo ""
echo "✅ Migrations completed!"
echo ""
sleep 2

# Step 2: Deploy backend
echo "🔷 Step 2/3: Deploying backend API..."
echo "======================================"
gcloud builds submit \
    --config=cloudbuild-backend.yaml \
    --substitutions=_REGION="$REGION"

echo ""
echo "✅ Backend deployed!"
echo ""
sleep 2

# Step 3: Get backend URL and deploy frontend
echo "⚛️  Step 3/3: Deploying frontend..."
echo "==================================="

BACKEND_URL=$(gcloud run services describe devfest-backend \
    --region=$REGION \
    --format="value(status.url)")

echo "Using Backend URL: $BACKEND_URL"
echo ""

gcloud builds submit \
    --config=cloudbuild-frontend.yaml \
    --substitutions=_REGION="$REGION",_API_URL="$BACKEND_URL"

echo ""
echo "✅ Frontend deployed!"
echo ""

# Get final URLs
FRONTEND_URL=$(gcloud run services describe devfest-frontend \
    --region=$REGION \
    --format="value(status.url)")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎨 Frontend: $FRONTEND_URL"
echo "🔗 Backend:  $BACKEND_URL"
echo ""
echo "🚀 Open your application:"
echo "   $FRONTEND_URL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

