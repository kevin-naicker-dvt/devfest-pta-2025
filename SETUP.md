# DevFest PTA 2025 - Setup Guide

## Phase 1: Hello World Architecture Test

This guide will help you set up and test the basic 3-tier architecture locally using Docker.

### Architecture Overview

```
┌─────────────────────┐
│   React Frontend    │  Port 3000
│   (TypeScript)      │
└──────────┬──────────┘
           │
           │ HTTP/REST
           │
┌──────────▼──────────┐
│   NestJS Backend    │  Port 3001
│   (API Service)     │
└──────────┬──────────┘
           │
           │ TypeORM
           │
┌──────────▼──────────┐
│   PostgreSQL DB     │  Port 5432
│   (hello_world)     │
└─────────────────────┘
```

### Step-by-Step Setup

#### Step 1: Prerequisites Check

Open PowerShell and verify:

```powershell
# Check Docker
docker --version
docker-compose --version

# Check if Docker Desktop is running
docker ps
```

#### Step 2: Clone and Navigate

```powershell
git clone https://github.com/kevin-naicker-dvt/devfest-pta-2025.git
cd devfest-pta-2025
```

#### Step 3: Create Environment File

Create `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=devfest_db
DB_USER=devfest_user
DB_PASSWORD=DevF3st123-pluto-is-plan3t

# Backend Configuration
BACKEND_PORT=3001
NODE_ENV=development

# Frontend Configuration
FRONTEND_PORT=3000
REACT_APP_API_URL=http://localhost:3001
```

#### Step 4: Build and Start Services

```powershell
# Build and start all services
docker-compose -f docker/docker-compose.local.yml up --build

# Or run in detached mode (background)
docker-compose -f docker/docker-compose.local.yml up --build -d
```

**Expected Output:**
```
✓ Network devfest-network created
✓ Container devfest-postgres-local started
✓ Container devfest-backend-local started
✓ Container devfest-frontend-local started
```

#### Step 5: Verify Services

**Check Container Status:**
```powershell
docker ps
```

You should see 3 running containers:
- `devfest-postgres-local`
- `devfest-backend-local`
- `devfest-frontend-local`

**Check Backend Health:**
```powershell
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-21T...",
  "service": "devfest-backend"
}
```

**Check Database Connection:**
```powershell
docker exec -it devfest-postgres-local psql -U devfest_user -d devfest_db -c "SELECT * FROM hello_world;"
```

#### Step 6: Test the Application

1. Open browser: http://localhost:3000
2. You should see: **"Hello World from DevFest PTA 2025! 🚀"**
3. The message is fetched from PostgreSQL via NestJS API

### Useful Docker Commands

```powershell
# View logs for all services
docker-compose -f docker/docker-compose.local.yml logs -f

# View logs for specific service
docker-compose -f docker/docker-compose.local.yml logs -f backend

# Stop all services
docker-compose -f docker/docker-compose.local.yml down

# Stop and remove volumes (clean slate)
docker-compose -f docker/docker-compose.local.yml down -v

# Rebuild a specific service
docker-compose -f docker/docker-compose.local.yml up --build backend

# Execute command in container
docker exec -it devfest-backend-local sh
```

### Testing Checklist

- [ ] All 3 containers are running
- [ ] Backend health endpoint responds
- [ ] Database contains hello_world record
- [ ] Frontend loads successfully
- [ ] Frontend displays message from database
- [ ] No errors in Docker logs

### Common Issues and Solutions

**Port Already in Use:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

**Database Not Ready:**
- Wait 10-15 seconds for PostgreSQL to initialize
- Check logs: `docker-compose -f docker/docker-compose.local.yml logs postgres`

**Frontend Can't Reach Backend:**
- Verify backend is running: `curl http://localhost:3001/api/health`
- Check browser console for CORS errors
- Ensure `.env` has correct `REACT_APP_API_URL`

**Build Errors:**
- Clear Docker cache: `docker system prune -a`
- Rebuild: `docker-compose -f docker/docker-compose.local.yml up --build --force-recreate`

### Next Steps

Once the Hello World architecture test is successful:

1. ✅ Local Docker setup validated
2. ✅ Database connectivity confirmed
3. ✅ API communication verified
4. ⏭️ Ready to build recruitment application features

---

## Phase 2: GCP Deployment (Coming Next)

After local testing is complete, we'll deploy to Google Cloud Platform using:
- Cloud Build for Docker image building
- Cloud Run or GKE for container deployment
- Cloud SQL for PostgreSQL database

Configuration files for GCP deployment are in `docker/docker-compose.demo.yml` and `.env.demo.example`.

