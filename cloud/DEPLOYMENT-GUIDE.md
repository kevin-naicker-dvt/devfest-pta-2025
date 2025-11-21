# Complete GCP Deployment Guide - DevFest PTA 2025

## 📋 Overview

This guide provides step-by-step instructions to deploy the DevFest Recruitment Application to Google Cloud Platform using automated Cloud Build pipelines.

## Architecture

```
┌──────────────────────────────────────────────────┐
│              GitHub Repository                    │
│     (kevin-naicker-dvt/devfest-pta-2025)         │
└────────────────┬─────────────────────────────────┘
                 │
                 │ Push to main
                 ▼
        ┌────────────────────┐
        │   Cloud Build      │
        │   Triggers         │
        └────────┬───────────┘
                 │
        ┌────────┴───────────────────────┐
        │                                │
        ▼                                ▼
┌───────────────┐              ┌─────────────────┐
│ Backend Build │              │ Frontend Build  │
│ + Deploy      │              │ + Deploy        │
└───────┬───────┘              └────────┬────────┘
        │                               │
        │                               │
        ▼                               ▼
┌───────────────┐              ┌─────────────────┐
│  Cloud Run    │              │   Cloud Run     │
│  (Backend)    │◄─────────────│  (Frontend)     │
│  + Cloud SQL  │              │                 │
│  Connection   │              │                 │
└───────────────┘              └─────────────────┘
        │
        │
        ▼
┌───────────────┐
│   Cloud SQL   │
│  (PostgreSQL) │
└───────────────┘
```

---

## 🚀 Deployment Steps

### Phase 1: Initial Setup (One-Time)

#### 1.1 Prerequisites

```bash
# Install gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set your project
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID
```

#### 1.2 Enable APIs

```bash
# Run this script to enable all required APIs
bash cloud/scripts/enable-apis.sh
```

Or manually:

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

#### 1.3 Setup Cloud SQL

Follow the detailed guide:
```bash
# See cloud/CLOUD-SQL-SETUP.md
```

Quick commands:
```bash
export REGION="us-central1"
export DB_PASSWORD="DevF3st123-pluto-is-plan3t"

# Create Cloud SQL instance (takes 5-10 minutes)
gcloud sql instances create devfest-postgres \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=$REGION \
    --root-password=$DB_PASSWORD

# Create database
gcloud sql databases create devfest_db --instance=devfest-postgres

# Create user
gcloud sql users create devfest_user \
    --instance=devfest-postgres \
    --password=$DB_PASSWORD

# Store password in Secret Manager
echo -n "$DB_PASSWORD" | gcloud secrets create db-password \
    --data-file=- \
    --replication-policy="automatic"
```

#### 1.4 Configure Service Account Permissions

```bash
# Run permissions setup script
bash cloud/scripts/setup-permissions.sh
```

Or manually:
```bash
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Grant Cloud SQL Client role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${BUILD_SA}" \
    --role="roles/cloudsql.client"

# Grant Cloud Run Admin role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${BUILD_SA}" \
    --role="roles/run.admin"

# Grant Service Account User role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${BUILD_SA}" \
    --role="roles/iam.serviceAccountUser"

# Grant Secret Manager access
gcloud secrets add-iam-policy-binding db-password \
    --member="serviceAccount:${BUILD_SA}" \
    --role="roles/secretmanager.secretAccessor"
```

---

### Phase 2: Database Migrations

#### 2.1 Run Migrations Manually (First Time)

```bash
# Submit migration build
gcloud builds submit \
    --config=cloudbuild-migrate.yaml \
    --substitutions=_INSTANCE_CONNECTION_NAME="$PROJECT_ID:us-central1:devfest-postgres"
```

**Expected Output:**
```
✅ Migrations completed successfully!
Tables created:
  - hello_world
  - applications
Sample data loaded: 3 applications
```

#### 2.2 Verify Migrations

```bash
# Connect to database
gcloud sql connect devfest-postgres --user=devfest_user --database=devfest_db

# Run queries
\dt                           # List tables
SELECT * FROM hello_world;    # Check hello_world
SELECT * FROM applications;   # Check applications
\q                            # Exit
```

---

### Phase 3: Backend Deployment

#### 3.1 Manual Backend Deployment

```bash
# Submit backend build and deploy
gcloud builds submit \
    --config=cloudbuild-backend.yaml \
    --substitutions=_REGION="us-central1"
```

**Build Steps:**
1. ✅ Build Docker image
2. ✅ Push to Container Registry
3. ✅ Deploy to Cloud Run
4. ✅ Connect to Cloud SQL
5. ✅ Display backend URL

#### 3.2 Get Backend URL

```bash
# Save this URL for frontend deployment!
gcloud run services describe devfest-backend \
    --region=us-central1 \
    --format="value(status.url)"
```

Example output: `https://devfest-backend-abc123xyz.run.app`

#### 3.3 Test Backend

```bash
BACKEND_URL=$(gcloud run services describe devfest-backend --region=us-central1 --format="value(status.url)")

# Test health endpoint
curl $BACKEND_URL/api/health

# Test hello endpoint
curl $BACKEND_URL/api/hello

# Test applications endpoint
curl $BACKEND_URL/api/applications
```

---

### Phase 4: Frontend Deployment

#### 4.1 Deploy Frontend with Backend URL

```bash
# Get backend URL
BACKEND_URL=$(gcloud run services describe devfest-backend \
    --region=us-central1 \
    --format="value(status.url)")

# Deploy frontend with backend URL
gcloud builds submit \
    --config=cloudbuild-frontend.yaml \
    --substitutions=_REGION="us-central1",_API_URL="$BACKEND_URL"
```

**Build Steps:**
1. ✅ Get backend URL
2. ✅ Build Docker image with REACT_APP_API_URL
3. ✅ Push to Container Registry
4. ✅ Deploy to Cloud Run
5. ✅ Display frontend URL

#### 4.2 Get Frontend URL

```bash
gcloud run services describe devfest-frontend \
    --region=us-central1 \
    --format="value(status.url)"
```

#### 4.3 Test Frontend

Open the URL in your browser!

---

### Phase 5: Automated CI/CD (GitHub Integration)

#### 5.1 Connect GitHub Repository

```bash
# Navigate to Cloud Console
# https://console.cloud.google.com/cloud-build/triggers

# 1. Click "Connect Repository"
# 2. Select "GitHub"
# 3. Authenticate with GitHub
# 4. Select repository: kevin-naicker-dvt/devfest-pta-2025
# 5. Click "Connect"
```

#### 5.2 Create Backend Trigger

```yaml
Name: backend-deploy
Event: Push to branch
Branch: ^main$
Included files filter: backend/**, cloudbuild-backend.yaml
Configuration: cloudbuild-backend.yaml
Substitutions:
  _REGION: us-central1
```

#### 5.3 Create Frontend Trigger

```yaml
Name: frontend-deploy
Event: Push to branch
Branch: ^main$
Included files filter: frontend/**, cloudbuild-frontend.yaml
Configuration: cloudbuild-frontend.yaml
Substitutions:
  _REGION: us-central1
  _API_URL: <BACKEND_URL>
```

#### 5.4 Test Automated Deployment

```bash
# Make a change to backend
echo "// Test change" >> backend/src/main.ts

# Commit and push
git add .
git commit -m "test: trigger backend deployment"
git push origin main

# Watch build in Cloud Console
gcloud builds list --limit=5
```

---

## 🔧 Configuration Files Reference

### cloudbuild-migrate.yaml
- **Purpose**: Run database migrations
- **Trigger**: Manual only
- **Duration**: ~1-2 minutes

### cloudbuild-backend.yaml
- **Purpose**: Build and deploy backend API
- **Trigger**: Push to main (backend files changed)
- **Duration**: ~3-5 minutes

### cloudbuild-frontend.yaml
- **Purpose**: Build and deploy frontend
- **Trigger**: Push to main (frontend files changed)
- **Duration**: ~4-6 minutes

---

## 📊 Cost Estimates

### Monthly Costs (Minimal Traffic)

| Service | Configuration | Estimated Cost |
|---------|--------------|----------------|
| Cloud SQL | db-f1-micro, 10GB | $8-12/month |
| Cloud Run (Backend) | 256Mi RAM, 1 CPU | $0-5/month |
| Cloud Run (Frontend) | 256Mi RAM, 1 CPU | $0-5/month |
| Cloud Build | 120 builds/month | Free tier |
| **Total** | | **$8-20/month** |

### Cost Optimization

1. **Use Cloud SQL on-demand**: Delete when not demoing
2. **Scale to zero**: Cloud Run automatically scales to 0
3. **Free tier**: First 2M Cloud Run requests free
4. **Build cache**: Speeds up builds and reduces costs

---

## 🧪 Testing Checklist

After deployment, verify:

- [ ] Backend health endpoint returns 200
- [ ] Backend can query database
- [ ] Frontend loads successfully
- [ ] Frontend can call backend API
- [ ] Can submit job application
- [ ] Can switch between roles
- [ ] Recruiter can update applications
- [ ] Applicant can see updates

---

## 🔍 Monitoring & Logging

### View Logs

```bash
# Backend logs
gcloud run services logs read devfest-backend \
    --region=us-central1 \
    --limit=50

# Frontend logs  
gcloud run services logs read devfest-frontend \
    --region=us-central1 \
    --limit=50

# Build logs
gcloud builds log <BUILD_ID>
```

### Cloud Console URLs

- **Cloud Run**: https://console.cloud.google.com/run
- **Cloud SQL**: https://console.cloud.google.com/sql
- **Cloud Build**: https://console.cloud.google.com/cloud-build
- **Logs Explorer**: https://console.cloud.google.com/logs

---

## 🐛 Troubleshooting

### Backend won't start

**Problem**: Container exits with error
```bash
# Check logs
gcloud run services logs read devfest-backend --limit=100

# Common issues:
# - Database connection failed → Check Cloud SQL connection
# - Secret not found → Verify Secret Manager setup
# - Permission denied → Check service account roles
```

### Frontend shows connection error

**Problem**: Can't reach backend
```bash
# Verify backend URL in frontend build
# Rebuild frontend with correct backend URL
BACKEND_URL=$(gcloud run services describe devfest-backend --region=us-central1 --format="value(status.url)")
gcloud builds submit --config=cloudbuild-frontend.yaml --substitutions=_API_URL="$BACKEND_URL"
```

### Database connection timeout

**Problem**: Backend can't connect to Cloud SQL
```bash
# Check Cloud SQL instance is running
gcloud sql instances describe devfest-postgres

# Verify Cloud SQL connection in Cloud Run
gcloud run services describe devfest-backend --format="yaml" | grep cloudsql
```

### Build fails with permissions error

**Problem**: Cloud Build can't access resources
```bash
# Re-run permissions setup
bash cloud/scripts/setup-permissions.sh
```

---

## 🔄 Update Workflow

### Updating Backend

```bash
# 1. Make changes to backend code
# 2. Commit and push
git add backend/
git commit -m "feat: add new feature"
git push origin main

# 3. Watch automated deployment
gcloud builds list --limit=1 --filter="tags=backend"
```

### Updating Frontend

```bash
# 1. Make changes to frontend code
# 2. Commit and push
git add frontend/
git commit -m "feat: improve UI"
git push origin main

# 3. Watch automated deployment
gcloud builds list --limit=1 --filter="tags=frontend"
```

### Running New Migrations

```bash
# 1. Add new migration file
# database/migrations/002_new_migration.sql

# 2. Update cloudbuild-migrate.yaml to include new file

# 3. Run migration
gcloud builds submit --config=cloudbuild-migrate.yaml
```

---

## 🧹 Cleanup

### Delete Everything

```bash
# Delete Cloud Run services
gcloud run services delete devfest-backend --region=us-central1 --quiet
gcloud run services delete devfest-frontend --region=us-central1 --quiet

# Delete Cloud SQL instance
gcloud sql instances delete devfest-postgres --quiet

# Delete secrets
gcloud secrets delete db-password --quiet

# Delete container images
gcloud container images delete gcr.io/$PROJECT_ID/devfest-backend --quiet
gcloud container images delete gcr.io/$PROJECT_ID/devfest-frontend --quiet
```

### Pause (Keep but Stop Costs)

```bash
# Stop Cloud SQL instance (can restart later)
gcloud sql instances patch devfest-postgres --activation-policy=NEVER

# Cloud Run automatically scales to zero (no cost when not used)
```

---

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [GitHub Repository](https://github.com/kevin-naicker-dvt/devfest-pta-2025)

---

**Ready for DevFest PTA 2025! 🚀**

