# GCP Deployment Guide - DevFest PTA 2025

This guide covers deploying the application to Google Cloud Platform.

## Prerequisites

- GCP Account with billing enabled
- GCP Project created
- `gcloud` CLI installed and authenticated
- GitHub repository connected to Cloud Build

## Architecture on GCP

```
┌─────────────────────────────────────────┐
│          Cloud Load Balancer            │
└─────────┬───────────────────┬───────────┘
          │                   │
          │                   │
┌─────────▼──────────┐   ┌────▼──────────┐
│  Cloud Run/GKE     │   │  Cloud Run/GKE│
│  Frontend          │   │  Backend      │
│  (React + Nginx)   │   │  (NestJS)     │
└────────────────────┘   └────┬──────────┘
                              │
                              │
                    ┌─────────▼──────────┐
                    │   Cloud SQL        │
                    │   (PostgreSQL)     │
                    └────────────────────┘
```

## Step 1: Setup Cloud SQL (PostgreSQL)

### 1.1 Create Cloud SQL Instance

```bash
# Set project ID
export PROJECT_ID=your-project-id
gcloud config set project $PROJECT_ID

# Create Cloud SQL instance
gcloud sql instances create devfest-postgres \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=DevF3st123-pluto-is-plan3t

# Create database
gcloud sql databases create devfest_db \
    --instance=devfest-postgres

# Create user
gcloud sql users create devfest_user \
    --instance=devfest-postgres \
    --password=DevF3st123-pluto-is-plan3t
```

### 1.2 Get Cloud SQL Connection Details

```bash
# Get instance connection name
gcloud sql instances describe devfest-postgres --format="value(connectionName)"

# Get public IP (if using public IP)
gcloud sql instances describe devfest-postgres --format="value(ipAddresses[0].ipAddress)"
```

### 1.3 Initialize Database

```bash
# Connect to Cloud SQL
gcloud sql connect devfest-postgres --user=devfest_user --database=devfest_db

# Run the init script (paste contents of database/init.sql)
# Or upload and execute:
gcloud sql import sql devfest-postgres gs://your-bucket/init.sql \
    --database=devfest_db
```

## Step 2: Setup Cloud Build Triggers

### 2.1 Connect GitHub Repository

1. Go to Cloud Console → Cloud Build → Triggers
2. Click "Connect Repository"
3. Select GitHub and authorize
4. Choose repository: `kevin-naicker-dvt/devfest-pta-2025`

### 2.2 Create Backend Build Trigger

```yaml
Name: devfest-backend-build
Event: Push to branch
Branch: ^main$
Configuration: Cloud Build configuration file
Location: /cloudbuild-backend.yaml
```

### 2.3 Create Frontend Build Trigger

```yaml
Name: devfest-frontend-build
Event: Push to branch
Branch: ^main$
Configuration: Cloud Build configuration file
Location: /cloudbuild-frontend.yaml
Substitution variables:
  _API_URL: https://YOUR-BACKEND-URL
```

## Step 3: Deploy Backend to Cloud Run

### 3.1 Deploy Backend

```bash
# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Deploy backend
gcloud run deploy devfest-backend \
    --image=gcr.io/$PROJECT_ID/devfest-backend:latest \
    --platform=managed \
    --region=us-central1 \
    --allow-unauthenticated \
    --set-env-vars="DB_HOST=CLOUD_SQL_IP,DB_PORT=5432,DB_NAME=devfest_db,DB_USER=devfest_user,DB_PASSWORD=DevF3st123-pluto-is-plan3t,NODE_ENV=production" \
    --port=3001

# Get backend URL
gcloud run services describe devfest-backend \
    --region=us-central1 \
    --format="value(status.url)"
```

### 3.2 Configure Cloud SQL Connection

If using Cloud SQL Proxy:

```bash
gcloud run deploy devfest-backend \
    --image=gcr.io/$PROJECT_ID/devfest-backend:latest \
    --platform=managed \
    --region=us-central1 \
    --allow-unauthenticated \
    --add-cloudsql-instances=PROJECT_ID:REGION:devfest-postgres \
    --set-env-vars="DB_HOST=/cloudsql/PROJECT_ID:REGION:devfest-postgres,DB_PORT=5432,DB_NAME=devfest_db,DB_USER=devfest_user,DB_PASSWORD=DevF3st123-pluto-is-plan3t"
```

## Step 4: Deploy Frontend to Cloud Run

```bash
# Update cloudbuild-frontend.yaml with backend URL
# Then deploy

gcloud run deploy devfest-frontend \
    --image=gcr.io/$PROJECT_ID/devfest-frontend:latest \
    --platform=managed \
    --region=us-central1 \
    --allow-unauthenticated \
    --port=80

# Get frontend URL
gcloud run services describe devfest-frontend \
    --region=us-central1 \
    --format="value(status.url)"
```

## Step 5: Configure Domain (Optional)

### 5.1 Map Custom Domain

```bash
# Map domain to Cloud Run service
gcloud run domain-mappings create \
    --service=devfest-frontend \
    --domain=your-domain.com \
    --region=us-central1
```

## Step 6: Environment Configuration

Create `.env.demo` locally for reference:

```env
# Cloud SQL Configuration
DB_HOST=<CLOUD_SQL_IP>
DB_PORT=5432
DB_NAME=devfest_db
DB_USER=devfest_user
DB_PASSWORD=DevF3st123-pluto-is-plan3t

# Backend Configuration
BACKEND_PORT=8080
NODE_ENV=production

# Frontend Configuration
REACT_APP_API_URL=https://<BACKEND_CLOUD_RUN_URL>
```

## Testing the Deployment

### Test Backend
```bash
curl https://YOUR-BACKEND-URL/api/health
curl https://YOUR-BACKEND-URL/api/hello
```

### Test Frontend
Open browser: `https://YOUR-FRONTEND-URL`

## Monitoring and Logs

### View Cloud Run Logs
```bash
# Backend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=devfest-backend" --limit 50

# Frontend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=devfest-frontend" --limit 50
```

### Cloud Console
- Navigate to Cloud Run → Select service → Logs tab

## CI/CD Pipeline

Once Cloud Build triggers are set up:

1. Push to `main` branch
2. Cloud Build automatically builds Docker images
3. Images are pushed to Container Registry
4. Deploy manually or set up automatic deployment

### Manual Deployment After Build
```bash
# After successful build, deploy new version
gcloud run deploy devfest-backend \
    --image=gcr.io/$PROJECT_ID/devfest-backend:latest \
    --region=us-central1

gcloud run deploy devfest-frontend \
    --image=gcr.io/$PROJECT_ID/devfest-frontend:latest \
    --region=us-central1
```

## Cost Optimization

- Use Cloud Run (pay per use) instead of always-on compute
- Use smallest Cloud SQL tier for demo (db-f1-micro)
- Enable Cloud Build cache for faster builds
- Set up automatic scaling limits

## Security Best Practices

1. **Use Secret Manager** for sensitive credentials:
```bash
# Store password in Secret Manager
echo -n "DevF3st123-pluto-is-plan3t" | gcloud secrets create db-password --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding db-password \
    --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

2. **Enable VPC Connector** for private Cloud SQL access

3. **Configure CORS** properly in backend

4. **Use Cloud Armor** for DDoS protection

## Cleanup

To delete all resources:

```bash
# Delete Cloud Run services
gcloud run services delete devfest-backend --region=us-central1
gcloud run services delete devfest-frontend --region=us-central1

# Delete Cloud SQL instance
gcloud sql instances delete devfest-postgres

# Delete Container Registry images
gcloud container images delete gcr.io/$PROJECT_ID/devfest-backend
gcloud container images delete gcr.io/$PROJECT_ID/devfest-frontend
```

## Troubleshooting

**Backend can't connect to Cloud SQL:**
- Verify Cloud SQL IP/connection string
- Check firewall rules
- Ensure Cloud SQL Admin API is enabled
- Consider using Cloud SQL Proxy

**CORS errors:**
- Update backend CORS configuration with frontend URL
- Redeploy backend service

**Build failures:**
- Check Cloud Build logs in console
- Verify Dockerfile paths
- Ensure sufficient build timeout

---

For local development, refer to [SETUP.md](./SETUP.md)

