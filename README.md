# DevFest PTA 2025 - Recruitment Application

A 3-tier web application built for Google Developer Conference, demonstrating modern cloud-native architecture.

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: NestJS
- **Database**: PostgreSQL
- **Deployment**: Google Cloud Platform
- **Containerization**: Docker

## Project Structure

```
devfest-pta-2025/
├── frontend/          # React + TypeScript application
├── backend/           # NestJS API service
├── docker/            # Docker configurations
├── database/          # Database initialization scripts
└── README.md
```

## Local Development Setup

### Prerequisites

- **Docker Desktop** (required for containerized deployment)
- **Node.js 18+** (optional, for local development without Docker)
- **Git**

### Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```powershell
   git clone https://github.com/kevin-naicker-dvt/devfest-pta-2025.git
   cd devfest-pta-2025
   ```

2. **Create environment file**
   
   Create a `.env` file in the root directory:
   ```powershell
   Copy-Item .env.example .env
   ```
   
   Or manually create `.env` with:
   ```env
   DB_HOST=postgres
   DB_PORT=5432
   DB_NAME=devfest_db
   DB_USER=devfest_user
   DB_PASSWORD=DevF3st123-pluto-is-plan3t
   BACKEND_PORT=3001
   FRONTEND_PORT=3000
   REACT_APP_API_URL=http://localhost:3001
   NODE_ENV=development
   ```

3. **Start the application**
   ```powershell
   docker-compose -f docker/docker-compose.local.yml up --build
   ```
   
   The first build will take a few minutes. Subsequent starts will be faster.

4. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001/api/health
   - **Database**: localhost:5432

5. **Stop the application**
   ```powershell
   docker-compose -f docker/docker-compose.local.yml down
   ```

### Development Without Docker

#### Backend Setup
```powershell
cd backend
npm install

# Create .env in backend directory with database connection details
# Make sure PostgreSQL is running locally

npm run start:dev
```

#### Frontend Setup
```powershell
cd frontend
npm install
npm start
```

### Troubleshooting

**Issue**: Docker containers won't start
- Ensure Docker Desktop is running
- Check if ports 3000, 3001, and 5432 are available
- Try: `docker-compose -f docker/docker-compose.local.yml down -v` then rebuild

**Issue**: Database connection error
- Wait for PostgreSQL to be fully initialized (check logs)
- Verify environment variables in `.env` file
- Check Docker network connectivity

**Issue**: Frontend can't connect to backend
- Verify backend is running on http://localhost:3001
- Check CORS settings in backend
- Ensure `REACT_APP_API_URL` is set correctly

## GCP Demo Deployment

### Quick Start (5 Commands)

See [`cloud/QUICKSTART-GCP.md`](cloud/QUICKSTART-GCP.md) for the fastest path to deployment.

```bash
# 1. Setup (one-time, ~10 minutes)
bash cloud/scripts/enable-apis.sh
# Create Cloud SQL, database, and secret (see QUICKSTART)
bash cloud/scripts/setup-permissions.sh

# 2. Deploy everything (~10 minutes)
bash cloud/scripts/deploy-all.sh
```

### Deployment Files

- **Cloud Build Pipelines**:
  - [`cloudbuild-migrate.yaml`](cloudbuild-migrate.yaml) - Database migrations
  - [`cloudbuild-backend.yaml`](cloudbuild-backend.yaml) - Backend API + Cloud Run
  - [`cloudbuild-frontend.yaml`](cloudbuild-frontend.yaml) - Frontend + Cloud Run

- **Documentation**:
  - [`cloud/QUICKSTART-GCP.md`](cloud/QUICKSTART-GCP.md) - Quick 5-command setup
  - [`cloud/DEPLOYMENT-GUIDE.md`](cloud/DEPLOYMENT-GUIDE.md) - Complete deployment guide
  - [`cloud/CLOUD-SQL-SETUP.md`](cloud/CLOUD-SQL-SETUP.md) - Cloud SQL configuration
  - [`DEPLOYMENT-SUMMARY.md`](DEPLOYMENT-SUMMARY.md) - Architecture overview

### Automated CI/CD

Cloud Build triggers automatically deploy on push to `main`:
- Backend changes → Triggers `cloudbuild-backend.yaml`
- Frontend changes → Triggers `cloudbuild-frontend.yaml`
- Migrations → Manual trigger via `cloudbuild-migrate.yaml`

## Application Features

### Phase 1: Hello World
- Basic connectivity test
- Database integration verification
- Docker architecture validation

### Phase 2: Recruitment Application
- Job application submission
- Application queue management
- Recruiter dashboard
- Status tracking

## Environment Variables

See `.env.example` for local development and `.env.demo.example` for GCP deployment.

## Repository

GitHub: https://github.com/kevin-naicker-dvt/devfest-pta-2025

## License

MIT
