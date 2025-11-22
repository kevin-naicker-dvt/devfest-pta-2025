# 📋 Demo Cheat Sheet - Quick Reference

---

## 🔗 Important URLs

```
Cloud Build Triggers:
https://console.cloud.google.com/cloud-build/triggers?region=africa-south1&project=dvt-lab-devfest-2025

Cloud Build History:
https://console.cloud.google.com/cloud-build/builds?project=dvt-lab-devfest-2025

Cloud Run Services:
https://console.cloud.google.com/run?project=dvt-lab-devfest-2025

CloudSQL Instances:
https://console.cloud.google.com/sql/instances?project=dvt-lab-devfest-2025
```

---

## ⚡ Quick Commands

```bash
# Set project
gcloud config set project dvt-lab-devfest-2025

# Get service URLs
gcloud run services describe devfest-backend --region=africa-south1 --format='value(status.url)'
gcloud run services describe devfest-frontend --region=africa-south1 --format='value(status.url)'

# Test backend
curl $(gcloud run services describe devfest-backend --region=africa-south1 --format='value(status.url)')/hello

# View recent builds
gcloud builds list --limit=5

# Tail logs
gcloud run services logs tail devfest-backend --region=africa-south1
gcloud run services logs tail devfest-frontend --region=africa-south1
```

---

## 🎯 Demo Flow (5 minutes)

1. **Show GitHub Repo** → "Full-stack application"
2. **Show YAML files** → "4 Cloud Build configs"
3. **Make code change** → Edit a component
4. **Commit & Push** → `git commit -am "Demo update" && git push`
5. **Show Cloud Build** → 3 parallel builds running
6. **Show deployment** → ~15 min to production
7. **Refresh frontend** → Changes are live!

---

## 🏗️ The 4 YAML Files

1. `cloudbuild-db-setup.yaml` → Creates CloudSQL (one-time)
2. `cloudbuild-db-migrations.yaml` → Runs migrations (automatic)
3. `cloudbuild-backend.yaml` → Deploys API (automatic)
4. `cloudbuild-frontend.yaml` → Deploys UI (automatic)

---

## 📊 Key Metrics to Highlight

- **Deployment time**: ~15 minutes (from commit to production)
- **Build parallelization**: 3 jobs run simultaneously
- **Auto-scaling**: 0 to 1000 instances automatically
- **Cost**: $0 when idle (scales to zero)
- **Region**: africa-south1 (South Africa)

---

## 💬 Demo Script Snippets

### Opening
> "Today I'll show you a complete CI/CD pipeline using Google Cloud Build and Cloud Run. This is a full-stack recruitment application that deploys automatically every time we push code."

### Making Changes
> "Let me update this welcome message. Watch what happens when I commit and push..."

### Showing Cloud Build
> "As soon as I pushed, Cloud Build automatically started three parallel jobs: database migrations, backend deployment, and frontend deployment."

### Showing Results
> "Within 15 minutes, our changes are live in production. Let me refresh... and there's our updated message!"

### Closing
> "This is GitOps in action. Every code change is automatically tested, built, containerized, and deployed to production. No manual steps. No server management. Just push code and it goes live."

---

## ❓ Anticipated Questions & Answers

**Q: How much does this cost?**  
A: CloudSQL: ~$7/month (db-f1-micro), Cloud Run: $0 when idle, Cloud Build: First 120 min/day free

**Q: How secure is this?**  
A: CloudSQL uses private IP, Cloud Run has IAM authentication, secrets can use Secret Manager

**Q: Can we use this for production?**  
A: Yes! Add: multiple environments, automated tests, staging deployments, monitoring

**Q: What about rollbacks?**  
A: Cloud Run keeps previous revisions. One command to rollback: `gcloud run services update-traffic --to-revisions=PREVIOUS=100`

**Q: How does it scale?**  
A: Cloud Run auto-scales from 0 to 1000 instances based on request load. Response time: <100ms

**Q: What if the database goes down?**  
A: CloudSQL has automatic failover and backups. Enable high availability for mission-critical apps

---

## 🔧 Quick Fixes

### Build fails: Permission denied
```bash
PROJECT_NUMBER=$(gcloud projects describe dvt-lab-devfest-2025 --format='value(projectNumber)')
gcloud projects add-iam-policy-binding dvt-lab-devfest-2025 \
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
    --role="roles/run.admin"
```

### Frontend can't reach backend
Check CORS in `backend/src/main.ts` - should allow all origins for demo

### CloudSQL connection fails
Wait 10 minutes after creating instance (it takes time to fully provision)

---

## 📝 Configuration Values

```
GCP Project:    dvt-lab-devfest-2025
Region:         africa-south1
Database:       devfest_db
DB User:        devfest_user
DB Password:    DevF3st123-pluto-is-plan3t
DB Instance:    devfest-db-instance
```

---

## 🎬 Backup Demo Plan (if live demo fails)

1. Show pre-recorded build logs
2. Walk through the YAML files
3. Show the live deployed application
4. Explain architecture diagram
5. Show Cloud Console (services running)

---

## 🧹 Post-Demo Cleanup

```bash
# Delete everything
gcloud run services delete devfest-backend --region=africa-south1 --quiet
gcloud run services delete devfest-frontend --region=africa-south1 --quiet
gcloud sql instances delete devfest-db-instance --quiet
```

---

## 📱 Have Ready on Your Phone

- Cloud Console app (for monitoring)
- Build logs URL
- This cheat sheet

---

## ✅ Final Check (2 min before)

- [ ] Services are running
- [ ] Application loads in browser
- [ ] Cloud Console tabs open
- [ ] GitHub repo visible
- [ ] Terminal ready with gcloud auth
- [ ] Presenter notes handy
- [ ] Water bottle nearby 💧

---

**Break a leg! 🚀**

