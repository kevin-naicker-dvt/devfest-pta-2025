# 🚀 Quick Start Guide - DevFest PTA 2025

## Hello World Architecture Test

Get your 3-tier application running in **5 minutes**!

### ⚡ Quick Setup (Windows PowerShell)

```powershell
# 1. Clone the repository
git clone https://github.com/kevin-naicker-dvt/devfest-pta-2025.git
cd devfest-pta-2025

# 2. Create .env file (copy and paste this entire block)
@"
DB_HOST=postgres
DB_PORT=5432
DB_NAME=devfest_db
DB_USER=devfest_user
DB_PASSWORD=DevF3st123-pluto-is-plan3t
BACKEND_PORT=3001
FRONTEND_PORT=3000
REACT_APP_API_URL=http://localhost:3001
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8

# 3. Start the application
docker-compose -f docker/docker-compose.local.yml up --build -d

# 4. Wait for services to start (about 30 seconds)
Start-Sleep -Seconds 30

# 5. Open in browser
Start-Process "http://localhost:3000"
```

### ✅ Verify Everything Works

```powershell
# Check if all containers are running
docker ps

# Test backend API
curl http://localhost:3001/api/health

# Test database
docker exec devfest-postgres-local psql -U devfest_user -d devfest_db -c "SELECT * FROM hello_world;"
```

### 🎯 What You Should See

1. **Frontend (http://localhost:3000)**
   - Beautiful gradient UI
   - Message: "Hello World from DevFest PTA 2025! 🚀"
   - Tech stack icons (React, NestJS, PostgreSQL, Docker)

2. **Backend (http://localhost:3001/api/health)**
   ```json
   {
     "status": "ok",
     "timestamp": "2025-11-21T...",
     "service": "devfest-backend"
   }
   ```

3. **Database**
   - hello_world table with 1 record

### 🛠️ Useful Commands

```powershell
# View logs
docker-compose -f docker/docker-compose.local.yml logs -f

# View specific service logs
docker-compose -f docker/docker-compose.local.yml logs -f backend

# Stop all services
docker-compose -f docker/docker-compose.local.yml down

# Restart a service
docker-compose -f docker/docker-compose.local.yml restart backend

# Rebuild and restart
docker-compose -f docker/docker-compose.local.yml up --build -d

# Clean everything (including database data)
docker-compose -f docker/docker-compose.local.yml down -v
```

### 📊 Architecture Overview

```
Browser (Port 3000)
    ↓
React Frontend (TypeScript)
    ↓ HTTP/REST
NestJS Backend (Port 3001)
    ↓ TypeORM
PostgreSQL Database (Port 5432)
```

### 🔧 Troubleshooting

**Problem: Containers won't start**
```powershell
# Check if ports are in use
netstat -ano | findstr "3000 3001 5432"

# Stop conflicting services or use different ports
```

**Problem: Frontend shows "Failed to connect to backend"**
```powershell
# Check if backend is running
docker-compose -f docker/docker-compose.local.yml ps

# View backend logs
docker-compose -f docker/docker-compose.local.yml logs backend

# Restart backend
docker-compose -f docker/docker-compose.local.yml restart backend
```

**Problem: Database connection error**
```powershell
# Check database logs
docker-compose -f docker/docker-compose.local.yml logs postgres

# Wait longer for database to initialize (first run takes time)
Start-Sleep -Seconds 20

# Verify database is accessible
docker exec -it devfest-postgres-local psql -U devfest_user -d devfest_db
```

**Problem: Build errors**
```powershell
# Clean Docker cache and rebuild
docker system prune -a
docker-compose -f docker/docker-compose.local.yml up --build --force-recreate
```

### 🧪 Automated Testing Script

Run the comprehensive test script:

```powershell
.\scripts\test-local.ps1
```

This script will:
- ✅ Check Docker status
- ✅ Verify .env file
- ✅ Check port availability
- ✅ Start all services
- ✅ Test backend health
- ✅ Test frontend accessibility
- ✅ Test database connection

### 📚 Next Steps

Once Hello World works:

1. ✅ **Local Architecture Validated**
2. ✅ **Ready for Feature Development**
3. 📝 Build recruitment application features
4. ☁️ Deploy to Google Cloud Platform

### 📖 Documentation

- **Detailed Setup**: See [SETUP.md](./SETUP.md)
- **GCP Deployment**: See [GCP-DEPLOYMENT.md](./GCP-DEPLOYMENT.md)
- **Main README**: See [README.md](./README.md)

### 🆘 Need Help?

**Check container status:**
```powershell
docker-compose -f docker/docker-compose.local.yml ps
```

**View all logs:**
```powershell
docker-compose -f docker/docker-compose.local.yml logs -f
```

**Access backend container:**
```powershell
docker exec -it devfest-backend-local sh
```

**Access database directly:**
```powershell
docker exec -it devfest-postgres-local psql -U devfest_user -d devfest_db
```

---

**Ready to deploy to GCP?** See [GCP-DEPLOYMENT.md](./GCP-DEPLOYMENT.md)

**Want to develop locally without Docker?** See [SETUP.md](./SETUP.md) → "Development Without Docker"

