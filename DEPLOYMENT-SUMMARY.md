# GCP Deployment Summary - DevFest PTA 2025

## 📦 Files Created for GCP Deployment

### Configuration Files
1. **`cloudbuild-migrate.yaml`** - Automates database migrations
2. **`cloudbuild-backend.yaml`** - Builds and deploys backend API to Cloud Run
3. **`cloudbuild-frontend.yaml`** - Builds and deploys frontend to Cloud Run

### Documentation
4. **`cloud/CLOUD-SQL-SETUP.md`** - Complete Cloud SQL setup guide
5. **`cloud/DEPLOYMENT-GUIDE.md`** - Comprehensive deployment documentation
6. **`cloud/QUICKSTART-GCP.md`** - Quick 5-command deployment guide

### Helper Scripts
7. **`cloud/scripts/enable-apis.sh`** - Enables all required GCP APIs
8. **`cloud/scripts/setup-permissions.sh`** - Configures service account permissions
9. **`cloud/scripts/deploy-all.sh`** - One-command full deployment

---

## 🚀 Quick Deployment (TL;DR)

### Prerequisites
```bash
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID
```

### One-Time Setup (10-15 minutes)
```bash
# 1. Enable APIs
bash cloud/scripts/enable-apis.sh

# 2. Create Cloud SQL (takes 5-10 minutes)
gcloud sql instances create devfest-postgres \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=DevF3st123-pluto-is-plan3t

gcloud sql databases create devfest_db --instance=devfest-postgres
gcloud sql users create devfest_user \
    --instance=devfest-postgres \
    --password=DevF3st123-pluto-is-plan3t

# 3. Store credentials
echo -n "DevF3st123-pluto-is-plan3t" | gcloud secrets create db-password \
    --data-file=- --replication-policy="automatic"

# 4. Setup permissions
bash cloud/scripts/setup-permissions.sh
```

### Deploy Everything (10 minutes)
```bash
bash cloud/scripts/deploy-all.sh
```

### Get URLs
```bash
# Frontend
gcloud run services describe devfest-frontend \
    --region=us-central1 --format="value(status.url)"

# Backend
gcloud run services describe devfest-backend \
    --region=us-central1 --format="value(status.url)"
```

---

## 📋 Deployment Pipeline Flow

### 1. Database Migration Pipeline
**File**: `cloudbuild-migrate.yaml`

```
┌─────────────────────────────────────┐
│ GitHub Repository                   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Cloud Build: Migration              │
│ 1. Check Cloud SQL status           │
│ 2. Connect via Cloud SQL Proxy      │
│ 3. Run 001_create_applications.sql  │
│ 4. Verify tables created            │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Cloud SQL PostgreSQL                │
│ ✓ hello_world table                 │
│ ✓ applications table                │
│ ✓ Sample data loaded                │
└─────────────────────────────────────┘
```

**Trigger**: Manual or on-demand

### 2. Backend API Pipeline
**File**: `cloudbuild-backend.yaml`

```
┌─────────────────────────────────────┐
│ GitHub: Push to main (backend/)     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Cloud Build: Backend                │
│ 1. Build Docker image (NestJS)      │
│ 2. Push to Container Registry       │
│ 3. Deploy to Cloud Run              │
│ 4. Connect to Cloud SQL             │
│ 5. Set environment variables        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Cloud Run: devfest-backend          │
│ ✓ NestJS API running                │
│ ✓ Connected to Cloud SQL            │
│ ✓ Public URL available              │
└─────────────────────────────────────┘
```

**Trigger**: Automatic on push to `main` (backend files)

### 3. Frontend Pipeline
**File**: `cloudbuild-frontend.yaml`

```
┌─────────────────────────────────────┐
│ GitHub: Push to main (frontend/)    │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Cloud Build: Frontend               │
│ 1. Get backend URL                  │
│ 2. Build Docker image (React)       │
│    with REACT_APP_API_URL           │
│ 3. Push to Container Registry       │
│ 4. Deploy to Cloud Run              │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Cloud Run: devfest-frontend         │
│ ✓ React app with Nginx              │
│ ✓ Connected to backend API          │
│ ✓ Public URL available              │
└─────────────────────────────────────┘
```

**Trigger**: Automatic on push to `main` (frontend files)

---

## 🔄 Automated CI/CD Setup

### Setup Cloud Build Triggers

**Complete Guide**: See [`cloud/TRIGGER-SETUP-GUIDE.md`](cloud/TRIGGER-SETUP-GUIDE.md)

#### Quick Setup (Automated Script)

```bash
# One-command trigger setup
bash cloud/scripts/setup-triggers.sh
```

This creates 3 triggers:
1. **migrate-database** (manual) - Run migrations on-demand
2. **backend-deploy** (auto) - Deploy backend on code changes
3. **frontend-deploy** (auto) - Deploy frontend on code changes

#### Backend Trigger
```yaml
Name: backend-deploy
Event: Push to branch
Branch: ^main$
Included files: backend/**, cloudbuild-backend.yaml
Configuration: cloudbuild-backend.yaml
Substitutions:
  _REGION: us-central1
```

#### Frontend Trigger
```yaml
Name: frontend-deploy
Event: Push to branch
Branch: ^main$
Included files: frontend/**, cloudbuild-frontend.yaml
Configuration: cloudbuild-frontend.yaml
Substitutions:
  _REGION: us-central1
```

**Setup via Console**:
1. Go to: https://console.cloud.google.com/cloud-build/triggers
2. Connect Repository: `kevin-naicker-dvt/devfest-pta-2025`
3. Create triggers with configurations above

**Or use the automated script**:
```bash
bash cloud/scripts/setup-triggers.sh
```

---

## 💰 Cost Breakdown

### Monthly Costs (Low Traffic)

| Service | Configuration | Cost/Month |
|---------|--------------|------------|
| Cloud SQL (db-f1-micro) | 10GB storage | $8-12 |
| Cloud Run (Backend) | 256Mi RAM, scales to 0 | $0-5 |
| Cloud Run (Frontend) | 256Mi RAM, scales to 0 | $0-5 |
| Cloud Build | 120 builds/month | Free |
| Secret Manager | 1 secret, minimal access | $0 |
| Container Registry | <1GB images | $0-1 |
| **Total** | | **$8-20** |

### Demo Day Optimization
- Cloud Run scales to zero when not in use
- Only pay for active request time
- Cloud SQL can be paused between demos
- Estimated cost for demo day: **$1-2**

---

## 🎯 Key Features

### Automated Migrations
✅ Database schema changes deployed automatically
✅ Migration history tracked
✅ Rollback capability

### Zero-Downtime Deployments
✅ Cloud Run gradual rollout
✅ Health checks before traffic switch
✅ Automatic rollback on failure

### Auto-Scaling
✅ Backend: 0-10 instances
✅ Frontend: 0-10 instances
✅ Cloud SQL: Automatic storage increase

### Security
✅ Secrets stored in Secret Manager
✅ Cloud SQL private IP connection
✅ IAM-based access control
✅ HTTPS only (automatic SSL)

---

## 📊 Build Times

- **Database Migration**: 1-2 minutes
- **Backend Build + Deploy**: 3-5 minutes
- **Frontend Build + Deploy**: 4-6 minutes
- **Full Deployment**: ~10 minutes

---

## 🧪 Testing After Deployment

```bash
# Save URLs
BACKEND_URL=$(gcloud run services describe devfest-backend --region=us-central1 --format="value(status.url)")
FRONTEND_URL=$(gcloud run services describe devfest-frontend --region=us-central1 --format="value(status.url)")

# Test backend
curl $BACKEND_URL/api/health
curl $BACKEND_URL/api/hello
curl $BACKEND_URL/api/applications

# Open frontend
open $FRONTEND_URL  # Mac
start $FRONTEND_URL  # Windows
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `cloud/CLOUD-SQL-SETUP.md` | Detailed Cloud SQL setup |
| `cloud/DEPLOYMENT-GUIDE.md` | Complete deployment guide |
| `cloud/QUICKSTART-GCP.md` | 5-command quick start |
| `DEPLOYMENT-SUMMARY.md` | This file |

---

## 🛠️ Helper Scripts

All scripts in `cloud/scripts/`:

```bash
# Enable all GCP APIs
./cloud/scripts/enable-apis.sh

# Configure permissions
./cloud/scripts/setup-permissions.sh

# Deploy everything
./cloud/scripts/deploy-all.sh
```

---

## ✅ Pre-Demo Checklist

Before the conference:

- [ ] Cloud SQL instance created
- [ ] Secret Manager configured
- [ ] Permissions setup complete
- [ ] Migrations run successfully
- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] GitHub triggers configured
- [ ] Test the complete workflow
- [ ] Verify costs are as expected
- [ ] Save URLs for presentation

---

## 🎤 Demo Talking Points

1. **Architecture**: "3-tier app with React, NestJS, and PostgreSQL on GCP"
2. **Automation**: "Push to GitHub triggers automated builds via Cloud Build"
3. **Scalability**: "Cloud Run scales from 0 to 10 instances automatically"
4. **Cost**: "Under $20/month, scales to zero when not in use"
5. **Security**: "Secrets in Secret Manager, private database connection"
6. **Speed**: "Full deployment in ~10 minutes, zero-downtime updates"

---

**Ready for DevFest PTA 2025! 🎉**

For questions or issues, refer to:
- Full guide: `cloud/DEPLOYMENT-GUIDE.md`
- Quick start: `cloud/QUICKSTART-GCP.md`
- GitHub: https://github.com/kevin-naicker-dvt/devfest-pta-2025

