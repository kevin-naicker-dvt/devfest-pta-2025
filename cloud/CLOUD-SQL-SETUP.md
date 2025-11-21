# Cloud SQL Setup Guide - DevFest PTA 2025

## Prerequisites

- Google Cloud Project created
- `gcloud` CLI installed and authenticated
- Billing enabled on your project

## Step 1: Set Environment Variables

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
export REGION="us-central1"
export DB_INSTANCE_NAME="devfest-postgres"
export DB_NAME="devfest_db"
export DB_USER="devfest_user"
export DB_PASSWORD="DevF3st123-pluto-is-plan3t"

# Set the project
gcloud config set project $PROJECT_ID
```

## Step 2: Enable Required APIs

```bash
# Enable Cloud SQL Admin API
gcloud services enable sqladmin.googleapis.com

# Enable Cloud Build API
gcloud services enable cloudbuild.googleapis.com

# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Artifact Registry API
gcloud services enable artifactregistry.googleapis.com

# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com
```

## Step 3: Create Cloud SQL Instance

### Option A: Production-Ready Instance (Recommended for Demo)

```bash
gcloud sql instances create $DB_INSTANCE_NAME \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=$REGION \
    --root-password=$DB_PASSWORD \
    --database-flags=max_connections=100 \
    --backup-start-time=03:00 \
    --maintenance-window-day=SUN \
    --maintenance-window-hour=4 \
    --availability-type=zonal \
    --storage-type=SSD \
    --storage-size=10GB \
    --storage-auto-increase
```

### Option B: Minimal Cost Instance (For Testing)

```bash
gcloud sql instances create $DB_INSTANCE_NAME \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=$REGION \
    --root-password=$DB_PASSWORD \
    --no-backup
```

**Note**: Instance creation takes 5-10 minutes.

## Step 4: Create Database

```bash
# Create the database
gcloud sql databases create $DB_NAME \
    --instance=$DB_INSTANCE_NAME
```

## Step 5: Create Database User

```bash
# Create user
gcloud sql users create $DB_USER \
    --instance=$DB_INSTANCE_NAME \
    --password=$DB_PASSWORD
```

## Step 6: Get Connection Details

```bash
# Get instance connection name (needed for Cloud Run)
gcloud sql instances describe $DB_INSTANCE_NAME \
    --format="value(connectionName)"

# Save this output! Format: PROJECT_ID:REGION:INSTANCE_NAME
# Example: devfest-pta-2025:us-central1:devfest-postgres

# Get public IP address (if using public IP)
gcloud sql instances describe $DB_INSTANCE_NAME \
    --format="value(ipAddresses[0].ipAddress)"
```

## Step 7: Configure Database Access

### Option A: Cloud Run with Private IP (Recommended)

```bash
# No additional configuration needed
# Cloud Run will connect via Unix socket
```

### Option B: Cloud Run with Public IP

```bash
# Add Cloud Run's IP range to authorized networks
# Note: This is automatically handled when using Cloud SQL Proxy
```

## Step 8: Store Credentials in Secret Manager

```bash
# Create secret for database password
echo -n "$DB_PASSWORD" | gcloud secrets create db-password \
    --data-file=- \
    --replication-policy="automatic"

# Grant Cloud Build access to secret
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding db-password \
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# Grant Cloud Run access to secret
gcloud secrets add-iam-policy-binding db-password \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

## Step 9: Test Connection (Optional)

```bash
# Connect using Cloud SQL Proxy
gcloud sql connect $DB_INSTANCE_NAME --user=$DB_USER --database=$DB_NAME
# Enter password when prompted
```

## Step 10: Configure Cloud Build Service Account

```bash
# Get Cloud Build service account
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Grant Cloud SQL Client role to Cloud Build
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${BUILD_SA}" \
    --role="roles/cloudsql.client"

# Grant Cloud Run Admin role to Cloud Build (for deployments)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${BUILD_SA}" \
    --role="roles/run.admin"

# Grant Service Account User role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${BUILD_SA}" \
    --role="roles/iam.serviceAccountUser"
```

## Environment Variables Summary

Save these for your Cloud Build and Cloud Run configurations:

```bash
# Database Configuration
DB_HOST=/cloudsql/${PROJECT_ID}:${REGION}:${DB_INSTANCE_NAME}  # For Cloud Run
# OR
DB_HOST=<PUBLIC_IP>  # If using public IP

DB_PORT=5432
DB_NAME=devfest_db
DB_USER=devfest_user
DB_PASSWORD=<use Secret Manager>

# Cloud SQL Connection Name (for Cloud Run)
INSTANCE_CONNECTION_NAME=${PROJECT_ID}:${REGION}:${DB_INSTANCE_NAME}
```

## Cost Estimates

### db-f1-micro Instance
- **Compute**: ~$7-10/month (shared-core)
- **Storage**: ~$0.17/GB/month (SSD)
- **Backup**: ~$0.08/GB/month (if enabled)
- **Total**: ~$8-15/month for small instance

### Cost Optimization Tips
1. Use `db-f1-micro` for demos/development
2. Disable automated backups for testing
3. Delete instance when not in use
4. Use on-demand backups only when needed

## Verification Checklist

- [ ] Cloud SQL instance created and running
- [ ] Database created
- [ ] User created with correct password
- [ ] Connection name noted
- [ ] Public IP noted (if using)
- [ ] Secret Manager configured
- [ ] Cloud Build service account has permissions
- [ ] APIs enabled

## Next Steps

1. Run database migrations (see `cloudbuild-migrate.yaml`)
2. Deploy backend API (see `cloudbuild-backend.yaml`)
3. Deploy frontend (see `cloudbuild-frontend.yaml`)

## Cleanup (When Done)

```bash
# Delete the instance
gcloud sql instances delete $DB_INSTANCE_NAME

# Delete secrets
gcloud secrets delete db-password
```

## Troubleshooting

**Issue**: Connection timeout
- Check firewall rules
- Verify Cloud SQL Proxy is configured
- Check Cloud Run has Cloud SQL connection enabled

**Issue**: Authentication failed
- Verify password in Secret Manager
- Check user exists: `gcloud sql users list --instance=$DB_INSTANCE_NAME`

**Issue**: Permission denied
- Verify Cloud Build service account has `cloudsql.client` role
- Check Secret Manager IAM policies

---

**Ready for next step**: Database Migrations Pipeline

