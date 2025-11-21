# Cloud Build Triggers Setup Guide - DevFest PTA 2025

Complete guide to setting up automated Cloud Build triggers that deploy on every push to GitHub.

---

## 📋 Overview

Cloud Build Triggers automatically run your deployment pipelines when you push code to GitHub. This guide covers:

1. Connecting your GitHub repository
2. Creating triggers for migrations, backend, and frontend
3. Testing automated deployments
4. Managing trigger configurations

---

## 🔧 Prerequisites

Before setting up triggers:

- [ ] Google Cloud Project created
- [ ] APIs enabled (`bash cloud/scripts/enable-apis.sh`)
- [ ] Cloud SQL instance created and configured
- [ ] Permissions configured (`bash cloud/scripts/setup-permissions.sh`)
- [ ] GitHub repository: `kevin-naicker-dvt/devfest-pta-2025`

---

## 🚀 Method 1: Setup via Google Cloud Console (Recommended)

### Step 1: Connect GitHub Repository

1. **Navigate to Cloud Build Triggers**
   - Go to: https://console.cloud.google.com/cloud-build/triggers
   - Or: Cloud Console → Cloud Build → Triggers

2. **Click "CONNECT REPOSITORY"**
   
3. **Select Source**
   - Choose: **"GitHub (Cloud Build GitHub App)"**
   - Click: **"Continue"**

4. **Authenticate with GitHub**
   - Click: **"Authenticate"**
   - Sign in to GitHub if needed
   - Authorize Google Cloud Build app

5. **Select Repository**
   - Organization/Owner: `kevin-naicker-dvt`
   - Repository: `devfest-pta-2025`
   - Check: ✅ "I understand that GitHub content will be stored..."
   - Click: **"Connect"**

6. **Skip Trigger Creation (for now)**
   - Click: **"Done"** (we'll create triggers manually for better control)

---

### Step 2: Create Migration Trigger (Manual Only)

**Purpose**: Run database migrations on-demand

1. Click **"CREATE TRIGGER"**

2. **Configure Trigger**:
   ```
   Name: migrate-database
   Description: Run database migrations on Cloud SQL
   
   Event: Manual invocation
   
   Source:
   - Repository: kevin-naicker-dvt/devfest-pta-2025
   - Branch: ^main$
   
   Configuration:
   - Type: Cloud Build configuration file (yaml or json)
   - Location: Repository
   - Cloud Build configuration file: cloudbuild-migrate.yaml
   
   Substitution variables:
   _REGION: us-central1
   _INSTANCE_CONNECTION_NAME: ${PROJECT_ID}:us-central1:devfest-postgres
   _DB_NAME: devfest_db
   _DB_USER: devfest_user
   ```

3. Click **"CREATE"**

---

### Step 3: Create Backend Trigger (Auto-Deploy)

**Purpose**: Auto-deploy backend on code changes

1. Click **"CREATE TRIGGER"**

2. **Configure Trigger**:
   ```
   Name: backend-deploy
   Description: Build and deploy backend API to Cloud Run
   
   Event: Push to a branch
   
   Source:
   - Repository: kevin-naicker-dvt/devfest-pta-2025
   - Branch: ^main$
   
   Configuration:
   - Type: Cloud Build configuration file (yaml or json)
   - Location: Repository
   - Cloud Build configuration file: cloudbuild-backend.yaml
   
   Filters: (IMPORTANT - only trigger on backend changes)
   - Included files filter (glob):
     backend/**
     cloudbuild-backend.yaml
   
   Substitution variables:
   _REGION: us-central1
   _SERVICE_NAME: devfest-backend
   _INSTANCE_CONNECTION_NAME: ${PROJECT_ID}:us-central1:devfest-postgres
   _DB_NAME: devfest_db
   _DB_USER: devfest_user
   ```

3. Click **"CREATE"**

---

### Step 4: Create Frontend Trigger (Auto-Deploy)

**Purpose**: Auto-deploy frontend on code changes

1. Click **"CREATE TRIGGER"**

2. **Configure Trigger**:
   ```
   Name: frontend-deploy
   Description: Build and deploy frontend to Cloud Run
   
   Event: Push to a branch
   
   Source:
   - Repository: kevin-naicker-dvt/devfest-pta-2025
   - Branch: ^main$
   
   Configuration:
   - Type: Cloud Build configuration file (yaml or json)
   - Location: Repository
   - Cloud Build configuration file: cloudbuild-frontend.yaml
   
   Filters: (IMPORTANT - only trigger on frontend changes)
   - Included files filter (glob):
     frontend/**
     cloudbuild-frontend.yaml
   
   Substitution variables:
   _REGION: us-central1
   _SERVICE_NAME: devfest-frontend
   ```

3. Click **"CREATE"**

---

## 🖥️ Method 2: Setup via gcloud CLI

### Complete Script

Save this as `cloud/scripts/setup-triggers.sh`:

```bash
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
echo "⚠️  If this is your first time:"
echo "   1. Go to: https://console.cloud.google.com/cloud-build/triggers"
echo "   2. Click 'Connect Repository'"
echo "   3. Connect your GitHub repo: $REPO_OWNER/$REPO_NAME"
echo "   4. Then run this script"
echo ""
read -p "Press Enter to continue..."

# 1. Migration Trigger (Manual only)
echo "Creating migration trigger..."
gcloud builds triggers create manual \
    --name="migrate-database" \
    --description="Run database migrations on Cloud SQL" \
    --repo="https://github.com/$REPO_OWNER/$REPO_NAME" \
    --repo-type="GITHUB" \
    --branch="main" \
    --build-config="cloudbuild-migrate.yaml" \
    --substitutions="_REGION=$REGION,_INSTANCE_CONNECTION_NAME=$PROJECT_ID:$REGION:devfest-postgres,_DB_NAME=devfest_db,_DB_USER=devfest_user"

echo "✅ Migration trigger created"
echo ""

# 2. Backend Trigger (Auto on push)
echo "Creating backend trigger..."
gcloud builds triggers create github \
    --name="backend-deploy" \
    --description="Build and deploy backend API to Cloud Run" \
    --repo-name="$REPO_NAME" \
    --repo-owner="$REPO_OWNER" \
    --branch-pattern="^main$" \
    --build-config="cloudbuild-backend.yaml" \
    --included-files="backend/**,cloudbuild-backend.yaml" \
    --substitutions="_REGION=$REGION,_SERVICE_NAME=devfest-backend,_INSTANCE_CONNECTION_NAME=$PROJECT_ID:$REGION:devfest-postgres,_DB_NAME=devfest_db,_DB_USER=devfest_user"

echo "✅ Backend trigger created"
echo ""

# 3. Frontend Trigger (Auto on push)
echo "Creating frontend trigger..."
gcloud builds triggers create github \
    --name="frontend-deploy" \
    --description="Build and deploy frontend to Cloud Run" \
    --repo-name="$REPO_NAME" \
    --repo-owner="$REPO_OWNER" \
    --branch-pattern="^main$" \
    --build-config="cloudbuild-frontend.yaml" \
    --included-files="frontend/**,cloudbuild-frontend.yaml" \
    --substitutions="_REGION=$REGION,_SERVICE_NAME=devfest-frontend"

echo "✅ Frontend trigger created"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All triggers created successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "View triggers at:"
echo "https://console.cloud.google.com/cloud-build/triggers"
echo ""
echo "Next steps:"
echo "1. Run migration manually first time"
echo "2. Push code to trigger auto-deployments"
```

Make it executable and run:

```bash
chmod +x cloud/scripts/setup-triggers.sh
bash cloud/scripts/setup-triggers.sh
```

---

## 🧪 Testing Your Triggers

### Test 1: Manual Migration Trigger

```bash
# Via CLI
gcloud builds triggers run migrate-database --branch=main

# Or via Console:
# 1. Go to Cloud Build → Triggers
# 2. Find "migrate-database"
# 3. Click "RUN" → Select branch "main"
```

**Expected**: Database tables created with sample data

---

### Test 2: Backend Auto-Deploy

```bash
# Make a small change to backend
echo "// Trigger test" >> backend/src/main.ts

# Commit and push
git add backend/src/main.ts
git commit -m "test: trigger backend deployment"
git push origin main

# Watch the build
gcloud builds list --limit=5
# Or watch in console: https://console.cloud.google.com/cloud-build/builds
```

**Expected**: Backend automatically builds and deploys to Cloud Run

---

### Test 3: Frontend Auto-Deploy

```bash
# Make a small change to frontend
echo "// Trigger test" >> frontend/src/App.tsx

# Commit and push
git add frontend/src/App.tsx
git commit -m "test: trigger frontend deployment"
git push origin main

# Watch the build
gcloud builds list --limit=5
```

**Expected**: Frontend automatically builds and deploys to Cloud Run

---

## 📊 Trigger Configuration Summary

| Trigger | Event | Files Watched | Build Time | Auto-Deploy |
|---------|-------|---------------|------------|-------------|
| migrate-database | Manual only | All | 1-2 min | ❌ Manual |
| backend-deploy | Push to main | `backend/**` | 3-5 min | ✅ Yes |
| frontend-deploy | Push to main | `frontend/**` | 4-6 min | ✅ Yes |

---

## 🔍 Managing Triggers

### View All Triggers

```bash
# List all triggers
gcloud builds triggers list

# Describe specific trigger
gcloud builds triggers describe backend-deploy
```

### Update Trigger

```bash
# Update substitution variables
gcloud builds triggers update backend-deploy \
    --substitutions="_REGION=us-east1"

# Update included files
gcloud builds triggers update backend-deploy \
    --included-files="backend/**,cloudbuild-backend.yaml,database/**"
```

### Delete Trigger

```bash
# Delete a trigger
gcloud builds triggers delete backend-deploy
```

### Disable/Enable Trigger

Via Console:
1. Go to Triggers page
2. Click trigger name
3. Toggle "Enable trigger" switch

Via CLI:
```bash
# Disable
gcloud builds triggers update backend-deploy --disabled

# Enable
gcloud builds triggers update backend-deploy --no-disabled
```

---

## 🔔 Build Notifications (Optional)

### Setup Email Notifications

1. Go to: https://console.cloud.google.com/cloud-build/settings
2. Under "Notification options"
3. Add email addresses for:
   - Build failures
   - Build successes (optional)

### Setup Slack Notifications

Follow: https://cloud.google.com/build/docs/configuring-notifications/notifiers

---

## 🐛 Troubleshooting

### "Repository not found"

**Problem**: Can't create trigger, repo not connected

**Solution**:
1. Go to Cloud Console → Cloud Build → Triggers
2. Click "Connect Repository"
3. Connect your GitHub repo first
4. Then create triggers

---

### "Permission denied when building"

**Problem**: Build fails with permission errors

**Solution**:
```bash
# Re-run permissions setup
bash cloud/scripts/setup-permissions.sh
```

---

### "Trigger not firing on push"

**Problem**: Code pushed but trigger doesn't run

**Check**:
1. File path matches included files filter
2. Branch is `main` (not `master`)
3. Trigger is enabled (not disabled)

```bash
# List recent builds
gcloud builds list --limit=10

# Check trigger status
gcloud builds triggers describe backend-deploy
```

---

### "Build fails but works locally"

**Problem**: Docker build fails in Cloud Build

**Check**:
1. All files committed to git
2. `.dockerignore` not excluding needed files
3. Build timeout (increase if needed)

---

## 💡 Best Practices

### 1. **Use File Filters**
Only trigger builds when relevant files change:
```yaml
Included files: backend/**, cloudbuild-backend.yaml
```

### 2. **Manual Migrations**
Keep migration trigger manual to control when schema changes:
```yaml
Event: Manual invocation
```

### 3. **Substitution Variables**
Use substitutions for environment-specific values:
```yaml
Substitutions:
  _REGION: us-central1
  _DB_NAME: devfest_db
```

### 4. **Tag Your Builds**
Already included in cloudbuild.yaml files:
```yaml
tags: ['backend', 'devfest', 'cloud-run']
```

### 5. **Monitor Build History**
```bash
# View recent builds with status
gcloud builds list --limit=20 --format="table(id,status,source.repoSource.branchName,createTime)"
```

---

## 📋 Post-Setup Checklist

After setting up triggers:

- [ ] All 3 triggers created (migrate, backend, frontend)
- [ ] Tested manual migration trigger
- [ ] Tested backend auto-deploy
- [ ] Tested frontend auto-deploy
- [ ] Email notifications configured (optional)
- [ ] Team members have access to view builds
- [ ] Build history looks correct

---

## 🎯 Typical Workflow After Setup

### Day-to-Day Development

```bash
# 1. Make changes to backend
vim backend/src/app.controller.ts

# 2. Commit and push
git add .
git commit -m "feat: add new endpoint"
git push origin main

# 3. Watch auto-deployment (3-5 minutes)
# Backend automatically builds and deploys!

# 4. Make changes to frontend
vim frontend/src/App.tsx

# 5. Commit and push
git add .
git commit -m "feat: update UI"
git push origin main

# 6. Watch auto-deployment (4-6 minutes)
# Frontend automatically builds and deploys!
```

### After Schema Changes

```bash
# 1. Create new migration file
vim database/migrations/002_add_new_table.sql

# 2. Update cloudbuild-migrate.yaml to include new file

# 3. Commit changes
git add database/
git commit -m "feat: add new database table"
git push origin main

# 4. Run migration trigger manually
gcloud builds triggers run migrate-database --branch=main

# 5. Verify migration
gcloud sql connect devfest-postgres --user=devfest_user --database=devfest_db
\dt
```

---

## 🌐 View Build Status

### Via Console
- Builds Dashboard: https://console.cloud.google.com/cloud-build/builds
- Triggers: https://console.cloud.google.com/cloud-build/triggers

### Via CLI
```bash
# Recent builds
gcloud builds list --limit=10

# Watch a specific build
gcloud builds log <BUILD_ID> --stream

# Filter by trigger
gcloud builds list --filter="buildTriggerId:<TRIGGER_ID>"
```

---

## ✅ Success Indicators

After setup, you should see:

1. **3 triggers** listed in Cloud Build Triggers
2. **Green checkmarks** on successful builds
3. **Auto-deployments** on git push (backend & frontend)
4. **Build times**: ~3-6 minutes per service
5. **Cloud Run services** automatically updating

---

## 📚 Additional Resources

- [Cloud Build Triggers Documentation](https://cloud.google.com/build/docs/automating-builds/create-manage-triggers)
- [GitHub App Installation](https://github.com/apps/google-cloud-build)
- [Build Configuration Reference](https://cloud.google.com/build/docs/build-config-file-schema)
- [Trigger Filters](https://cloud.google.com/build/docs/automating-builds/create-manage-triggers#filter-build-config)

---

**🎉 You now have fully automated CI/CD for DevFest PTA 2025!**

Every push to `main` automatically deploys your changes to GCP Cloud Run.

