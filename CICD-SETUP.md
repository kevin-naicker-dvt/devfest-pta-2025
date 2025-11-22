# CI/CD Setup Guide - DevFest PTA 2025
## Cloud Build + Cloud Run Deployment

This guide provides step-by-step instructions to set up a complete CI/CD pipeline using Google Cloud Build and Cloud Run.

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **GCP Project**: `dvt-lab-devfest-2025`
2. **GitHub Repository**: Connected to your GCP project
3. **Required GCP APIs Enabled**:
   - Cloud Build API
   - Cloud Run API
   - Cloud SQL Admin API
   - Container Registry API
   - Compute Engine API

4. **IAM Permissions**: Cloud Build service account needs:
   - Cloud Run Admin
   - Cloud SQL Admin
   - Service Account User
   - Compute Network User

---

## 🔧 Configuration Parameters

```
GCP Project:    dvt-lab-devfest-2025
Region:         africa-south1
Database Name:  devfest_db
DB Username:    devfest_user
DB Password:    DevF3st123-pluto-is-plan3t
```

---

## 🚀 Setup Instructions

### Step 1: Enable Required APIs

Run these commands in Cloud Shell or your local terminal (with gcloud CLI):

```bash
gcloud config set project dvt-lab-devfest-2025

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable servicenetworking.googleapis.com
```

### Step 2: Configure Cloud Build Service Account Permissions

```bash
# Get the Cloud Build service account
PROJECT_NUMBER=$(gcloud projects describe dvt-lab-devfest-2025 --format='value(projectNumber)')
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

echo "Cloud Build Service Account: $CLOUD_BUILD_SA"

# Grant required roles
gcloud projects add-iam-policy-binding dvt-lab-devfest-2025 \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding dvt-lab-devfest-2025 \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/cloudsql.admin"

gcloud projects add-iam-policy-binding dvt-lab-devfest-2025 \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding dvt-lab-devfest-2025 \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/compute.networkUser"

echo "✓ Permissions granted successfully!"
```

### Step 3: Connect GitHub Repository to Cloud Build

1. Go to Cloud Build Triggers: https://console.cloud.google.com/cloud-build/triggers?region=africa-south1&project=dvt-lab-devfest-2025

2. Click **"CONNECT REPOSITORY"**

3. Select **GitHub** as the source

4. Authenticate and select your repository

5. Click **"CONNECT"**

---

## 🏗️ Create Cloud Build Triggers

### Trigger 1: Database Setup (One-Time, Manual Execution)

**Purpose**: Create CloudSQL instance, database, and user

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers?region=africa-south1&project=dvt-lab-devfest-2025)

2. Click **"CREATE TRIGGER"**

3. Configure:
   - **Name**: `db-setup-manual`
   - **Description**: `One-time CloudSQL database setup`
   - **Event**: Manual invocation (or GitHub push if you prefer)
   - **Source**: 
     - Repository: Your connected GitHub repo
     - Branch: `^main$`
   - **Configuration**:
     - Type: Cloud Build configuration file
     - Location: `/cloudbuild-db-setup.yaml`
   - **Substitution variables**:
     - `_DATABASE_NAME` = `devfest_db`
     - `_DB_USER` = `devfest_user`
     - `_DB_PASSWORD` = `DevF3st123-pluto-is-plan3t`

4. Click **"CREATE"**

5. **Run this trigger manually once** by clicking "RUN" on the trigger

---

### Trigger 2: Database Migrations

**Purpose**: Run database migrations on code changes

1. Click **"CREATE TRIGGER"**

2. Configure:
   - **Name**: `db-migrations`
   - **Description**: `Run database migrations on push to main`
   - **Event**: Push to a branch
   - **Source**:
     - Repository: Your connected GitHub repo
     - Branch: `^main$`
   - **Configuration**:
     - Type: Cloud Build configuration file
     - Location: `/cloudbuild-db-migrations.yaml`
   - **Substitution variables**:
     - `_DATABASE_NAME` = `devfest_db`
     - `_DB_USER` = `devfest_user`
     - `_DB_PASSWORD` = `DevF3st123-pluto-is-plan3t`

3. Click **"CREATE"**

---

### Trigger 3: Backend API Deployment

**Purpose**: Build and deploy backend API to Cloud Run

1. Click **"CREATE TRIGGER"**

2. Configure:
   - **Name**: `backend-deploy`
   - **Description**: `Build and deploy backend API to Cloud Run`
   - **Event**: Push to a branch
   - **Source**:
     - Repository: Your connected GitHub repo
     - Branch: `^main$`
   - **Configuration**:
     - Type: Cloud Build configuration file
     - Location: `/cloudbuild-backend.yaml`
   - **Substitution variables**:
     - `_DATABASE_NAME` = `devfest_db`
     - `_DB_USER` = `devfest_user`
     - `_DB_PASSWORD` = `DevF3st123-pluto-is-plan3t`

3. Click **"CREATE"**

---

### Trigger 4: Frontend Deployment

**Purpose**: Build and deploy frontend to Cloud Run

1. Click **"CREATE TRIGGER"**

2. Configure:
   - **Name**: `frontend-deploy`
   - **Description**: `Build and deploy frontend to Cloud Run`
   - **Event**: Push to a branch
   - **Source**:
     - Repository: Your connected GitHub repo
     - Branch: `^main$`
   - **Configuration**:
     - Type: Cloud Build configuration file
     - Location: `/cloudbuild-frontend.yaml`

3. Click **"CREATE"**

---

## 🎯 Deployment Workflow

### Initial Setup (One-Time)

1. **Run Database Setup Trigger** (manually)
   ```
   Trigger: db-setup-manual
   Action: Click "RUN" button
   Result: CloudSQL instance, database, and user created
   ```

### Automatic Deployments (On Every Push)

When you push code to the `main` branch, the following happens automatically:

1. **Database Migrations** (`cloudbuild-db-migrations.yaml`)
   - Runs first
   - Applies any new migration scripts
   - Duration: ~2-3 minutes

2. **Backend Deployment** (`cloudbuild-backend.yaml`)
   - Builds Docker image
   - Deploys to Cloud Run
   - Connects to CloudSQL
   - Duration: ~5-7 minutes

3. **Frontend Deployment** (`cloudbuild-frontend.yaml`)
   - Gets backend URL automatically
   - Builds Docker image with correct API URL
   - Deploys to Cloud Run
   - Duration: ~5-7 minutes

**Total deployment time**: ~12-15 minutes per push

---

## 🧪 Testing the Deployment

### 1. Get Service URLs

After deployment, get your service URLs:

```bash
# Get Backend URL
BACKEND_URL=$(gcloud run services describe devfest-backend \
    --region=africa-south1 \
    --format='value(status.url)')

echo "Backend URL: $BACKEND_URL"

# Get Frontend URL
FRONTEND_URL=$(gcloud run services describe devfest-frontend \
    --region=africa-south1 \
    --format='value(status.url)')

echo "Frontend URL: $FRONTEND_URL"
```

### 2. Test Backend API

```bash
# Health check
curl $BACKEND_URL

# Hello World endpoint
curl $BACKEND_URL/hello

# Applications endpoint
curl $BACKEND_URL/applications
```

### 3. Test Frontend

Open the frontend URL in your browser:
```bash
echo "Open this URL: $FRONTEND_URL"
```

You should see the DevFest recruitment application with:
- Apply page
- My Applications page
- Recruiter Dashboard

---

## 📊 Monitoring and Logs

### View Build Logs

1. Go to [Cloud Build History](https://console.cloud.google.com/cloud-build/builds?project=dvt-lab-devfest-2025)
2. Click on any build to see detailed logs

### View Cloud Run Logs

```bash
# Backend logs
gcloud run services logs read devfest-backend \
    --region=africa-south1 \
    --limit=50

# Frontend logs
gcloud run services logs read devfest-frontend \
    --region=africa-south1 \
    --limit=50
```

### View CloudSQL Logs

1. Go to [Cloud SQL Instances](https://console.cloud.google.com/sql/instances?project=dvt-lab-devfest-2025)
2. Click on `devfest-db-instance`
3. Go to **Logs** tab

---

## 🔧 Troubleshooting

### Issue: Cloud Build fails with "Permission Denied"

**Solution**: Ensure Cloud Build service account has required permissions (see Step 2)

```bash
# Re-run permission grants
PROJECT_NUMBER=$(gcloud projects describe dvt-lab-devfest-2025 --format='value(projectNumber)')
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud projects add-iam-policy-binding dvt-lab-devfest-2025 \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/run.admin"
```

### Issue: CloudSQL instance already exists

**Solution**: This is expected if you run the setup trigger multiple times. The script handles this gracefully.

### Issue: Frontend can't connect to backend

**Solution**: 
1. Verify backend is deployed: `gcloud run services list --region=africa-south1`
2. Check backend URL in frontend logs
3. Ensure backend allows unauthenticated requests

### Issue: Database connection fails

**Solution**:
1. Verify CloudSQL instance is running
2. Check Cloud Run service has CloudSQL connection configured
3. Verify database credentials in substitution variables

---

## 🔐 Security Best Practices

For production deployments, consider:

1. **Use Secret Manager** for database passwords:
   ```bash
   # Store password in Secret Manager
   echo -n "DevF3st123-pluto-is-plan3t" | \
       gcloud secrets create db-password --data-file=-
   
   # Grant Cloud Build access
   gcloud secrets add-iam-policy-binding db-password \
       --member="serviceAccount:${CLOUD_BUILD_SA}" \
       --role="roles/secretmanager.secretAccessor"
   ```

2. **Restrict Cloud Run access** (remove `--allow-unauthenticated` for internal services)

3. **Use Cloud SQL Private IP** (already configured in setup)

4. **Enable Cloud Armor** for DDoS protection

5. **Set up VPC Service Controls** for additional security

---

## 📝 Pipeline Architecture

```
┌─────────────────┐
│   GitHub Push   │
│    to main      │
└────────┬────────┘
         │
         ↓
┌────────────────────────────────────────┐
│     Cloud Build Triggers (3 jobs)      │
└────────────────────────────────────────┘
         │
         ├──────────────┬──────────────┐
         ↓              ↓              ↓
┌─────────────┐  ┌──────────┐  ┌──────────┐
│    DB       │  │ Backend  │  │ Frontend │
│ Migrations  │  │  Build   │  │  Build   │
└──────┬──────┘  └────┬─────┘  └────┬─────┘
       │              │              │
       ↓              ↓              ↓
┌──────────┐   ┌───────────┐  ┌───────────┐
│ CloudSQL │←──│ Cloud Run │  │ Cloud Run │
│          │   │  Backend  │  │ Frontend  │
└──────────┘   └───────────┘  └───────────┘
                      ↑              │
                      └──────────────┘
                    API Connection
```

---

## 🎓 Learning Outcomes

By completing this setup, you've implemented:

✅ **Infrastructure as Code** - All infrastructure defined in YAML  
✅ **CI/CD Pipeline** - Automated build and deployment  
✅ **Container Orchestration** - Docker + Cloud Run  
✅ **Database Migrations** - Automated schema management  
✅ **Microservices Architecture** - Separate frontend/backend services  
✅ **Cloud-Native Deployment** - Serverless with auto-scaling  
✅ **GitOps Workflow** - Code changes trigger deployments  

---

## 🚀 Next Steps

### For the Demo

1. Make a small code change (e.g., update a message in the UI)
2. Commit and push to main branch
3. Watch the Cloud Build triggers execute automatically
4. See the changes reflected in your deployed application

### Beyond the Demo

Consider implementing:
- [ ] Multiple environments (dev, staging, prod)
- [ ] Branch-based deployments
- [ ] Automated testing in pipeline
- [ ] Blue/green deployments
- [ ] Canary releases
- [ ] Infrastructure monitoring and alerts

---

## 📞 Support

If you encounter issues:

1. Check [Cloud Build Logs](https://console.cloud.google.com/cloud-build/builds?project=dvt-lab-devfest-2025)
2. Review [Cloud Run Logs](https://console.cloud.google.com/run?project=dvt-lab-devfest-2025)
3. Verify [CloudSQL Status](https://console.cloud.google.com/sql/instances?project=dvt-lab-devfest-2025)

---

## 📄 Quick Reference

### Useful Commands

```bash
# Set project
gcloud config set project dvt-lab-devfest-2025

# List Cloud Run services
gcloud run services list --region=africa-south1

# View recent builds
gcloud builds list --limit=5

# Get service URLs
gcloud run services describe devfest-backend --region=africa-south1 --format='value(status.url)'
gcloud run services describe devfest-frontend --region=africa-south1 --format='value(status.url)'

# Tail Cloud Run logs
gcloud run services logs tail devfest-backend --region=africa-south1
gcloud run services logs tail devfest-frontend --region=africa-south1

# Delete services (cleanup)
gcloud run services delete devfest-backend --region=africa-south1 --quiet
gcloud run services delete devfest-frontend --region=africa-south1 --quiet

# Delete CloudSQL instance (cleanup)
gcloud sql instances delete devfest-db-instance --quiet
```

---

**Happy Deploying! 🎉**

*DevFest PTA 2025 - Learn, Build, Deploy*

