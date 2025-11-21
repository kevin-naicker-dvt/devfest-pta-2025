# Quick Start - GCP Deployment (5 Commands)

## Prerequisites

- Google Cloud Project created
- `gcloud` CLI installed
- Billing enabled

## Step 1: Setup (One-Time)

```bash
# Set project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable APIs (takes ~1 minute)
bash cloud/scripts/enable-apis.sh

# Create Cloud SQL instance (takes 5-10 minutes)
gcloud sql instances create devfest-postgres \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=DevF3st123-pluto-is-plan3t

# Create database and user
gcloud sql databases create devfest_db --instance=devfest-postgres
gcloud sql users create devfest_user \
    --instance=devfest-postgres \
    --password=DevF3st123-pluto-is-plan3t

# Store password in Secret Manager
echo -n "DevF3st123-pluto-is-plan3t" | gcloud secrets create db-password \
    --data-file=- \
    --replication-policy="automatic"

# Setup permissions
bash cloud/scripts/setup-permissions.sh
```

## Step 2: Deploy Everything

```bash
# Deploy all: migrations + backend + frontend (takes ~10 minutes)
bash cloud/scripts/deploy-all.sh
```

## Step 3: Get URLs

```bash
# Frontend URL
gcloud run services describe devfest-frontend \
    --region=us-central1 \
    --format="value(status.url)"

# Backend URL
gcloud run services describe devfest-backend \
    --region=us-central1 \
    --format="value(status.url)"
```

## Done! 🎉

Open the frontend URL in your browser!

---

## Individual Deployments (Optional)

### Deploy Only Backend
```bash
gcloud builds submit --config=cloudbuild-backend.yaml
```

### Deploy Only Frontend
```bash
BACKEND_URL=$(gcloud run services describe devfest-backend --region=us-central1 --format="value(status.url)")
gcloud builds submit --config=cloudbuild-frontend.yaml --substitutions=_API_URL="$BACKEND_URL"
```

### Run Only Migrations
```bash
gcloud builds submit --config=cloudbuild-migrate.yaml
```

---

## Troubleshooting

**"Permission denied"**
→ Run `bash cloud/scripts/setup-permissions.sh`

**"Secret not found"**
→ Create secret: `echo -n "DevF3st123-pluto-is-plan3t" | gcloud secrets create db-password --data-file=-`

**"Cloud SQL instance not found"**
→ Check instance: `gcloud sql instances list`

---

For detailed documentation, see `cloud/DEPLOYMENT-GUIDE.md`

