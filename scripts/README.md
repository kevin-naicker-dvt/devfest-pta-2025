# 🧹 Database Cleanup Scripts

Scripts for managing and cleaning up your DevFest demo database.

---

## 📋 Scripts Overview

### 1. `clear-db-data.sh` / `clear-db-data.ps1`
**Purpose**: Clear all data but keep table structure  
**Use case**: Reset demo data between presentations  
**What it does**:
- ✅ Deletes all records from `applications` table
- ✅ Deletes all records from `hello_world` table
- ✅ Keeps table structure intact
- ✅ Keeps indexes and constraints

**When to use**: You want fresh data but don't want to recreate tables.

---

### 2. `reset-db.sh`
**Purpose**: Drop and recreate tables with sample data  
**Use case**: Complete database reset with fresh sample data  
**What it does**:
- ❌ Drops all tables
- ✅ Recreates tables from migration scripts
- ✅ Loads sample data (3 applications, 1 hello_world)

**When to use**: You want to completely reset to initial state.

---

### 3. `delete-everything.sh`
**Purpose**: Complete cleanup - delete all GCP resources  
**Use case**: After demo - avoid all charges  
**What it does**:
- ❌ Deletes Cloud Run frontend service
- ❌ Deletes Cloud Run backend service
- ❌ Deletes CloudSQL instance (all data lost!)
- ❌ Deletes container images

**When to use**: Demo is over and you want $0/month.

---

## 🚀 Usage

### Bash (Linux/Mac/Cloud Shell)

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Clear data only
./scripts/clear-db-data.sh

# Reset database completely
./scripts/reset-db.sh

# Delete everything
./scripts/delete-everything.sh
```

### PowerShell (Windows)

```powershell
# Clear data only
.\scripts\clear-db-data.ps1
```

---

## 📊 What Each Script Does

### Clear Data (Keep Structure)

```
Before:
├─ applications (10 records)
└─ hello_world (1 record)

After:
├─ applications (0 records) ✅ Structure intact
└─ hello_world (0 records) ✅ Structure intact
```

### Reset Database

```
Before:
├─ applications (any state)
└─ hello_world (any state)

After:
├─ applications (3 sample records) ✅ Fresh start
└─ hello_world (1 record) ✅ Fresh start
```

### Delete Everything

```
Before:
├─ Cloud Run Frontend ($)
├─ Cloud Run Backend ($)
├─ CloudSQL Instance ($$$)
└─ Container Images ($)

After:
├─ (nothing)
└─ Monthly cost: $0 ✅
```

---

## ⚠️ Prerequisites

### For Data Scripts (clear/reset)

You need `psql` installed:

**Ubuntu/Debian**:
```bash
sudo apt-get install postgresql-client
```

**Mac**:
```bash
brew install postgresql
```

**Windows**:
- Download from: https://www.postgresql.org/download/windows/
- Or use Cloud Shell (has psql pre-installed)

### For Delete Everything

Only needs `gcloud` CLI (already installed in Cloud Shell).

---

## 🔐 Security Note

These scripts use hardcoded credentials for demo purposes:
```
Password: DevF3st123-pluto-is-plan3t
```

**For production**, use:
- Google Cloud Secret Manager
- IAM authentication
- Environment variables

---

## 💡 Common Workflows

### Between Demo Sessions
```bash
# Clear old data, keep structure
./scripts/clear-db-data.sh

# Manually add fresh demo data via the UI
# Or push code to reload sample data
```

### Start Fresh for New Demo
```bash
# Complete reset with sample data
./scripts/reset-db.sh
```

### After DevFest (Avoid Charges)
```bash
# Delete everything
./scripts/delete-everything.sh
```

### Redeploy After Deletion
```bash
# 1. Recreate database
# Go to Cloud Console → Run db-setup-manual trigger

# 2. Redeploy application
git commit --allow-empty -m "Redeploy after cleanup"
git push origin main
```

---

## 🧪 Testing Scripts

### Test Clear Data
```bash
# Check current data
gcloud sql connect devfest-db-instance --user=devfest_user --database=devfest_db
SELECT COUNT(*) FROM applications;

# Run clear script
./scripts/clear-db-data.sh

# Verify empty
SELECT COUNT(*) FROM applications;  -- Should be 0
```

---

## 📞 Troubleshooting

### "psql: command not found"
Install PostgreSQL client (see Prerequisites above).

### "Connection refused"
Check CloudSQL instance is running:
```bash
gcloud sql instances describe devfest-db-instance
```

### "Permission denied"
Make script executable:
```bash
chmod +x scripts/*.sh
```

---

## ⏱️ Execution Times

| Script | Duration |
|--------|----------|
| clear-db-data.sh | ~5 seconds |
| reset-db.sh | ~10 seconds |
| delete-everything.sh | ~5-10 minutes |

---

## 💰 Cost Impact

| Action | Monthly Cost After |
|--------|-------------------|
| Clear data | ~$7-11 (no change) |
| Reset database | ~$7-11 (no change) |
| Delete everything | **$0** ✅ |

---

**Remember**: Always double-check before running destructive operations! 🚨

