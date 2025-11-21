#!/bin/bash

# Enable Required Google Cloud APIs
# DevFest PTA 2025

set -e

echo "🔧 Enabling required Google Cloud APIs..."
echo ""

# Array of APIs to enable
APIS=(
    "cloudbuild.googleapis.com"
    "run.googleapis.com"
    "sqladmin.googleapis.com"
    "secretmanager.googleapis.com"
    "artifactregistry.googleapis.com"
    "compute.googleapis.com"
    "cloudresourcemanager.googleapis.com"
)

# Enable each API
for api in "${APIS[@]}"; do
    echo "Enabling $api..."
    gcloud services enable $api
done

echo ""
echo "✅ All APIs enabled successfully!"
echo ""
echo "Enabled APIs:"
for api in "${APIS[@]}"; do
    echo "  ✓ $api"
done

