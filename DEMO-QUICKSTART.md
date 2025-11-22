# 🚀 Demo Quick Start - DevFest PTA 2025
## CI/CD with Cloud Build & Cloud Run

**Time to complete**: ~30 minutes  
**Difficulty**: Beginner-friendly

---

## 📋 Prerequisites Checklist

- [ ] GCP Project: `dvt-lab-devfest-2025` is active
- [ ] GitHub repo connected to Cloud Build
- [ ] You have Owner/Editor access to the GCP project

---

## ⚡ 5-Minute Setup

### 1. Enable APIs & Set Permissions

Copy and paste this entire block into Cloud Shell:

```bash
# Set project
gcloud config set project dvt-lab-devfest-2025

# Enable APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com sqladmin.googleapis.com containerregistry.googleapis.com compute.googleapis.com servicenetworking.googleapis.com

# Grant permissions to Cloud Build
PROJECT_NUMBER=$(gcloud projects describe dvt-lab-devfest-2025 --format='value(projectNumber)')
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

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

echo "✅ Setup complete!"
```

### 2. Connect GitHub Repository

1. Go to: https://console.cloud.google.com/cloud-build/triggers?region=africa-south1&project=dvt-lab-devfest-2025
2. Click **"CONNECT REPOSITORY"**
3. Select **GitHub** → Authenticate → Select your repo
4. Click **"CONNECT"**

---

## 🎯 Create Cloud Build Triggers

### Create All 4 Triggers

For each trigger below, click **"CREATE TRIGGER"** and fill in the details:

#### **Trigger 1: Database Setup** (Manual, One-Time)

```
Name:                  db-setup-manual
Description:           One-time CloudSQL database setup
Event:                 Manual invocation
Repository:            [Your GitHub repo]
Branch:                ^main$
Configuration Type:    Cloud Build configuration file
Configuration Path:    /cloudbuild-db-setup.yaml

Substitution Variables:
  _DATABASE_NAME  =  devfest_db
  _DB_USER        =  devfest_user
  _DB_PASSWORD    =  DevF3st123-pluto-is-plan3t
```

**⚠️ After creating, click "RUN" to execute once**

---

#### **Trigger 2: Database Migrations** (Automatic)

```
Name:                  db-migrations
Description:           Run database migrations on push
Event:                 Push to a branch
Repository:            [Your GitHub repo]
Branch:                ^main$
Configuration Type:    Cloud Build configuration file
Configuration Path:    /cloudbuild-db-migrations.yaml

Substitution Variables:
  _DATABASE_NAME  =  devfest_db
  _DB_USER        =  devfest_user
  _DB_PASSWORD    =  DevF3st123-pluto-is-plan3t
```

---

#### **Trigger 3: Backend Deployment** (Automatic)

```
Name:                  backend-deploy
Description:           Build and deploy backend API
Event:                 Push to a branch
Repository:            [Your GitHub repo]
Branch:                ^main$
Configuration Type:    Cloud Build configuration file
Configuration Path:    /cloudbuild-backend.yaml

Substitution Variables:
  _DATABASE_NAME  =  devfest_db
  _DB_USER        =  devfest_user
  _DB_PASSWORD    =  DevF3st123-pluto-is-plan3t
```

---

#### **Trigger 4: Frontend Deployment** (Automatic)

```
Name:                  frontend-deploy
Description:           Build and deploy frontend
Event:                 Push to a branch
Repository:            [Your GitHub repo]
Branch:                ^main$
Configuration Type:    Cloud Build configuration file
Configuration Path:    /cloudbuild-frontend.yaml

No substitution variables needed (auto-detects backend URL)
```

---

## 🎬 Demo Execution Flow

### Step 1: Initial Database Setup (One-Time)

1. Go to Cloud Build Triggers
2. Find `db-setup-manual` trigger
3. Click **"RUN"** button
4. Wait ~5-10 minutes for CloudSQL instance to be created
5. ✅ Database ready!

### Step 2: First Deployment

Push your code to main branch:

```bash
git add .
git commit -m "Initial CI/CD setup"
git push origin main
```

This will automatically trigger:
1. ✅ DB Migrations (~2 min)
2. ✅ Backend Deploy (~7 min)
3. ✅ Frontend Deploy (~7 min)

**Total time**: ~15 minutes

### Step 3: Get Your URLs

```bash
# Backend URL
gcloud run services describe devfest-backend \
    --region=africa-south1 \
    --format='value(status.url)'

# Frontend URL
gcloud run services describe devfest-frontend \
    --region=africa-south1 \
    --format='value(status.url)'
```

### Step 4: Test the Application

Open the Frontend URL in your browser. You should see:
- 📝 Apply page (submit job applications)
- 📋 My Applications page (view applications)
- 👔 Recruiter Dashboard (manage applications)

---

## 🎪 Demo Script

**For presenting to an audience:**

### 1. Show the GitHub Repository

> "This is our full-stack recruitment application. Frontend in React, backend in NestJS, PostgreSQL database."

### 2. Show the Cloud Build YAML Files

> "We have 4 Cloud Build configuration files:
> - Database setup (one-time)
> - Database migrations (automatic)
> - Backend deployment (automatic)
> - Frontend deployment (automatic)"

### 3. Make a Code Change

```bash
# Example: Update the welcome message
# Edit frontend/src/App.tsx or any component
```

> "Let me update the welcome message to demonstrate CI/CD..."

### 4. Commit and Push

```bash
git add .
git commit -m "Update welcome message for demo"
git push origin main
```

> "As soon as I push to main, Cloud Build triggers automatically..."

### 5. Show Cloud Build in Action

Open: https://console.cloud.google.com/cloud-build/builds?project=dvt-lab-devfest-2025

> "Here you can see:
> - 3 builds running in parallel
> - Database migrations executing
> - Backend building and deploying
> - Frontend building and deploying"

### 6. Show the Live Application

> "Within 15 minutes, our changes are live in production. Let me refresh the application..."

**Refresh the frontend URL**

> "And there's our updated message! That's GitOps in action."

### 7. Show Cloud Run Services

Open: https://console.cloud.google.com/run?project=dvt-lab-devfest-2025

> "Our services are running on Cloud Run:
> - Automatically scaled to zero when not in use
> - Scales up automatically on demand
> - Only pay for what you use"

---

## 📊 What to Highlight

### For Technical Audience:

✨ **Infrastructure as Code**: All configuration in YAML files  
✨ **GitOps**: Git as single source of truth  
✨ **Containerization**: Docker for consistent deployments  
✨ **Managed Services**: CloudSQL, Cloud Run (no server management)  
✨ **Auto-scaling**: Cloud Run scales 0→∞ automatically  
✨ **Security**: Private CloudSQL, IAM, service accounts  

### For Business Audience:

💰 **Cost Efficiency**: Pay only for actual usage  
⚡ **Fast Deployment**: Changes live in 15 minutes  
🔒 **Security**: Enterprise-grade Google infrastructure  
📈 **Scalability**: Handles 10 users or 10 million  
🛠️ **Low Maintenance**: No servers to manage  
🚀 **Developer Velocity**: Push code → automatically deployed  

---

## 🧪 Things to Test During Demo

1. **Submit a job application** (frontend → backend → database)
2. **View applications** (database → backend → frontend)
3. **View build logs** (show real-time progress)
4. **Show auto-scaling** (Cloud Run metrics)
5. **Make a live code change** (commit → watch it deploy)

---

## ⚠️ Common Demo Gotchas

### Issue: Build takes too long

**Solution**: Prepare by running one deployment before the demo. Subsequent builds use cached layers (faster).

### Issue: CloudSQL connection fails

**Solution**: Run the database setup trigger at least 10 minutes before the demo.

### Issue: Frontend can't connect to backend

**Solution**: Check CORS settings. Backend should allow all origins for demo.

### Issue: Audience wants to see the code

**Solution**: Have the GitHub repo open in another tab, ready to show.

---

## 🎯 Demo Talking Points

### Why Cloud Build?

> "Cloud Build is Google's native CI/CD tool. It's:
> - Fully managed (no Jenkins servers to maintain)
> - Integrated with GCP services
> - Scalable (parallel builds)
> - Cost-effective (first 120 minutes/day are free)"

### Why Cloud Run?

> "Cloud Run is Google's serverless container platform:
> - Deploy any containerized app
> - Automatic HTTPS endpoints
> - Built-in load balancing
> - Scale to zero (no idle costs)
> - Scale up in milliseconds"

### Why CloudSQL?

> "CloudSQL is managed PostgreSQL:
> - Automatic backups
> - High availability
> - Automatic security patches
> - Point-in-time recovery
> - Integrated with Cloud Run"

---

## 📸 Screenshots to Capture

For your presentation:

1. Cloud Build Triggers page (4 triggers configured)
2. Cloud Build running (3 parallel builds)
3. Cloud Run services page (2 services deployed)
4. CloudSQL instance details
5. Frontend application (all 3 pages)
6. Build logs (successful deployment)

---

## 🧹 Cleanup After Demo

```bash
# Delete Cloud Run services
gcloud run services delete devfest-backend --region=africa-south1 --quiet
gcloud run services delete devfest-frontend --region=africa-south1 --quiet

# Delete CloudSQL instance
gcloud sql instances delete devfest-db-instance --quiet

# Delete Container Registry images
gcloud container images delete gcr.io/dvt-lab-devfest-2025/devfest-backend --quiet
gcloud container images delete gcr.io/dvt-lab-devfest-2025/devfest-frontend --quiet
```

**Estimated cost if you forget to clean up**: ~$20/month for CloudSQL instance

---

## 📚 Resources for Follow-Up Questions

- Cloud Build Docs: https://cloud.google.com/build/docs
- Cloud Run Docs: https://cloud.google.com/run/docs
- CloudSQL Docs: https://cloud.google.com/sql/docs
- GitHub Actions alternative: https://docs.github.com/actions

---

## ✅ Pre-Demo Checklist

**30 minutes before:**
- [ ] Run database setup trigger
- [ ] Do one test deployment (warm up caches)
- [ ] Get frontend/backend URLs
- [ ] Test the application works
- [ ] Have Cloud Console open in tabs
- [ ] Have GitHub repo open
- [ ] Clear browser cache (for fresh demo)

**5 minutes before:**
- [ ] Close unnecessary tabs
- [ ] Zoom in browser (for visibility)
- [ ] Have demo script handy
- [ ] Take a deep breath 😊

---

**You're ready to rock this demo! 🎉**

*Good luck at DevFest PTA 2025!*

