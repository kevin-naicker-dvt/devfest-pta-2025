# Visual Guide: Setting Up Cloud Build Triggers

## 🎯 Complete Setup via Cloud Console (Click-by-Click)

This guide shows you **exactly where to click** in the Google Cloud Console.

---

## 📍 Part 1: Connect GitHub Repository (One-Time)

### 1.1 Navigate to Cloud Build

```
Google Cloud Console → Top Left Menu → Cloud Build → Triggers
```

**Direct URL**: `https://console.cloud.google.com/cloud-build/triggers?project=YOUR_PROJECT_ID`

---

### 1.2 Connect Repository

**What You'll See**: Empty triggers page (if first time)

**Click**: Blue button **"CONNECT REPOSITORY"**

---

### 1.3 Select Source

**What You'll See**: "Select source" dialog

**Click**: **"GitHub (Cloud Build GitHub App)"**

**Then**: Click **"CONTINUE"**

---

### 1.4 Authenticate with GitHub

**What You'll See**: "Authenticate" button

**Click**: **"AUTHENTICATE"**

**Then**: 
- Sign in to GitHub (if needed)
- Authorize "Google Cloud Build"
- Grant access to repositories

---

### 1.5 Select Your Repository

**What You'll See**: List of your GitHub repositories

**Select**:
- Owner: `kevin-naicker-dvt`
- Repository: ✅ Check **`devfest-pta-2025`**

**Check**: ✅ "I understand that GitHub content will be stored..."

**Click**: **"CONNECT"**

---

### 1.6 Skip Initial Trigger

**What You'll See**: "Create a trigger" dialog

**Click**: **"DONE"** (we'll create triggers manually with proper config)

---

## 📍 Part 2: Create Migration Trigger (Manual)

### 2.1 Create New Trigger

**Where**: Cloud Build → Triggers page

**Click**: **"CREATE TRIGGER"** (top of page)

---

### 2.2 Configure Migration Trigger

Fill in these fields:

#### Name
```
migrate-database
```

#### Description
```
Run database migrations on Cloud SQL
```

#### Event
**Select**: ● **"Manual invocation"**

#### Source
**Select**: 
- Repository: `kevin-naicker-dvt/devfest-pta-2025 (GitHub App)`
- Branch: `^main$`
- Comment control: Disabled

#### Configuration
- Type: ● **"Cloud Build configuration file (yaml or json)"**
- Location: ● **"Repository"**
- Cloud Build configuration file location: `cloudbuild-migrate.yaml`

#### Substitution variables (Click "ADD VARIABLE" for each)

| Variable Name | Value |
|---------------|-------|
| `_REGION` | `us-central1` |
| `_INSTANCE_CONNECTION_NAME` | `${PROJECT_ID}:us-central1:devfest-postgres` |
| `_DB_NAME` | `devfest_db` |
| `_DB_USER` | `devfest_user` |

**Click**: **"CREATE"** (bottom of page)

✅ Migration trigger created!

---

## 📍 Part 3: Create Backend Trigger (Auto-Deploy)

### 3.1 Create New Trigger

**Click**: **"CREATE TRIGGER"**

---

### 3.2 Configure Backend Trigger

#### Name
```
backend-deploy
```

#### Description
```
Build and deploy backend API to Cloud Run on code changes
```

#### Event
**Select**: ● **"Push to a branch"**

#### Source
- Repository: `kevin-naicker-dvt/devfest-pta-2025 (GitHub App)`
- Branch: `^main$`

#### Configuration
- Type: ● **"Cloud Build configuration file (yaml or json)"**
- Location: ● **"Repository"**
- Cloud Build configuration file location: `cloudbuild-backend.yaml`

#### Filters (IMPORTANT!)
**Click**: "SHOW INCLUDED AND IGNORED FILE FILTERS"

**Included files filter (glob)**:
```
backend/**
cloudbuild-backend.yaml
```

Leave "Ignored files filter" empty.

#### Substitution variables

| Variable Name | Value |
|---------------|-------|
| `_REGION` | `us-central1` |
| `_SERVICE_NAME` | `devfest-backend` |
| `_INSTANCE_CONNECTION_NAME` | `${PROJECT_ID}:us-central1:devfest-postgres` |
| `_DB_NAME` | `devfest_db` |
| `_DB_USER` | `devfest_user` |

**Click**: **"CREATE"**

✅ Backend trigger created!

---

## 📍 Part 4: Create Frontend Trigger (Auto-Deploy)

### 4.1 Create New Trigger

**Click**: **"CREATE TRIGGER"**

---

### 4.2 Configure Frontend Trigger

#### Name
```
frontend-deploy
```

#### Description
```
Build and deploy frontend to Cloud Run on code changes
```

#### Event
**Select**: ● **"Push to a branch"**

#### Source
- Repository: `kevin-naicker-dvt/devfest-pta-2025 (GitHub App)`
- Branch: `^main$`

#### Configuration
- Type: ● **"Cloud Build configuration file (yaml or json)"**
- Location: ● **"Repository"**
- Cloud Build configuration file location: `cloudbuild-frontend.yaml`

#### Filters (IMPORTANT!)
**Click**: "SHOW INCLUDED AND IGNORED FILE FILTERS"

**Included files filter (glob)**:
```
frontend/**
cloudbuild-frontend.yaml
```

Leave "Ignored files filter" empty.

#### Substitution variables

| Variable Name | Value |
|---------------|-------|
| `_REGION` | `us-central1` |
| `_SERVICE_NAME` | `devfest-frontend` |

**Click**: **"CREATE"**

✅ Frontend trigger created!

---

## 📍 Part 5: Verify Triggers

### What You Should See

On the Triggers page, you should now have **3 triggers**:

| Name | Event | Status |
|------|-------|--------|
| migrate-database | Manual | ⚪ (Ready) |
| backend-deploy | Push to main | ⚪ (Ready) |
| frontend-deploy | Push to main | ⚪ (Ready) |

---

## 🧪 Part 6: Test Your Triggers

### Test Migration Trigger (Manual)

1. Find `migrate-database` in the triggers list
2. Click the **"RUN"** button on the right
3. Select Branch: `main`
4. Click **"RUN TRIGGER"**
5. Click the build ID to watch progress
6. Wait for ✅ green checkmark (~2 minutes)

---

### Test Backend Trigger (Automatic)

Open PowerShell/Terminal:

```powershell
# Navigate to your repo
cd C:\Users\kevin\GitHub\devfest-pta-2025

# Make a small change
"// Test trigger" | Add-Content backend\src\main.ts

# Commit and push
git add backend/src/main.ts
git commit -m "test: trigger backend deployment"
git push origin main
```

**Then**:
1. Go back to Cloud Build → Triggers
2. Click on **"HISTORY"** tab (top of page)
3. You should see a build running automatically!
4. Click the build to watch progress
5. Wait for ✅ (~3-5 minutes)

---

### Test Frontend Trigger (Automatic)

```powershell
# Make a small change
"// Test trigger" | Add-Content frontend\src\App.tsx

# Commit and push
git add frontend/src/App.tsx
git commit -m "test: trigger frontend deployment"
git push origin main
```

**Check History**: You should see frontend build automatically triggered!

---

## 📊 Understanding the Triggers Page

### Triggers Tab
Shows all configured triggers with:
- ✅ Enabled/Disabled status
- Event type (Push/Manual)
- Last run status
- **RUN** button for manual triggers
- **⋮** menu for edit/delete/disable

### History Tab
Shows all builds with:
- Build ID (click to see details)
- Status (⏳ Running, ✅ Success, ❌ Failed)
- Trigger name that started it
- Branch/commit
- Duration
- Start time

---

## 🔧 Modifying Triggers

### Edit Existing Trigger

1. Go to Triggers page
2. Find your trigger
3. Click the trigger **name** (not the RUN button)
4. Click **"EDIT"** (top right)
5. Make changes
6. Click **"SAVE"**

### Common Modifications

**Change region**:
- Edit trigger → Substitution variables
- Change `_REGION` to `us-east1` or other

**Add more file filters**:
- Edit trigger → Filters
- Add to "Included files filter": `database/**`

**Disable trigger temporarily**:
- Edit trigger
- Toggle off **"Enable trigger"** switch
- Save

---

## 🎯 Quick Reference Card

### Where to Find Things

| What | Where |
|------|-------|
| Create Trigger | Cloud Build → Triggers → **CREATE TRIGGER** |
| View Builds | Cloud Build → **HISTORY** tab |
| Run Manual Trigger | Triggers → Find trigger → **RUN** button |
| Edit Trigger | Triggers → Click trigger **name** → **EDIT** |
| View Build Logs | History → Click **Build ID** |
| Disable Trigger | Edit trigger → Toggle **Enable trigger** |

### Important URLs

| Page | URL |
|------|-----|
| Triggers | `console.cloud.google.com/cloud-build/triggers` |
| Build History | `console.cloud.google.com/cloud-build/builds` |
| Cloud Run Services | `console.cloud.google.com/run` |
| Cloud SQL | `console.cloud.google.com/sql` |

---

## ✅ Final Checklist

After setup via console:

- [ ] Repository connected to Cloud Build
- [ ] 3 triggers created (migrate, backend, frontend)
- [ ] Migration trigger tested (ran manually)
- [ ] Backend trigger tested (auto-deployed on push)
- [ ] Frontend trigger tested (auto-deployed on push)
- [ ] All builds succeeded (green checkmarks)
- [ ] Cloud Run services are live
- [ ] Application works end-to-end

---

## 🎓 Pro Tips

### Tip 1: Watch Builds in Real-Time
- Click build ID from History
- See logs streaming live
- See each step complete

### Tip 2: Filter File Changes
Use included files filter to avoid unnecessary builds:
- `backend/**` = only backend files
- `frontend/**` = only frontend files
- Saves build minutes and time!

### Tip 3: Use Manual Triggers for Critical Operations
- Migrations = manual trigger
- Prevents accidental schema changes
- Run manually after review

### Tip 4: Check Build History First
Before creating triggers, check if they already exist:
- Cloud Build → Triggers
- Look for existing triggers
- Edit instead of creating duplicates

---

## 🆘 Troubleshooting via Console

### "Can't find my repository"
→ Go to Settings → GitHub → Reinstall app

### "Build fails immediately"
→ Click build ID → View logs → Check first failed step

### "Trigger doesn't fire"
→ Edit trigger → Check "Included files filter" matches your changes

### "Permission denied"
→ Cloud Build Settings → Enable required APIs

---

**🎉 You're all set!** Now every push to `main` automatically deploys your app to GCP!

For CLI alternative, see: [`cloud/scripts/setup-triggers.sh`](../scripts/setup-triggers.sh)

