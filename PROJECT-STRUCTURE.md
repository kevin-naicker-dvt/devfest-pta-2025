# Project Structure - DevFest PTA 2025

## Complete Directory Layout

```
devfest-pta-2025/
│
├── frontend/                          # React + TypeScript Frontend
│   ├── public/
│   │   └── index.html                # HTML template
│   ├── src/
│   │   ├── App.tsx                   # Main application component
│   │   ├── App.css                   # Application styles
│   │   ├── index.tsx                 # React entry point
│   │   ├── index.css                 # Global styles
│   │   └── react-app-env.d.ts        # TypeScript declarations
│   ├── package.json                  # Frontend dependencies
│   ├── tsconfig.json                 # TypeScript configuration
│   └── .dockerignore                 # Docker ignore patterns
│
├── backend/                           # NestJS Backend API
│   ├── src/
│   │   ├── entities/
│   │   │   └── hello-world.entity.ts # Database entity
│   │   ├── app.controller.ts         # API endpoints
│   │   ├── app.service.ts            # Business logic
│   │   ├── app.module.ts             # Application module
│   │   └── main.ts                   # Application entry point
│   ├── package.json                  # Backend dependencies
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── nest-cli.json                 # NestJS CLI configuration
│   └── .dockerignore                 # Docker ignore patterns
│
├── docker/                            # Docker Configurations
│   ├── Dockerfile.backend            # Backend Docker build
│   ├── Dockerfile.frontend           # Frontend Docker build
│   ├── nginx.conf                    # Nginx configuration for frontend
│   ├── docker-compose.local.yml      # Local development setup
│   └── docker-compose.demo.yml       # GCP demo setup
│
├── database/                          # Database Scripts
│   └── init.sql                      # Database initialization script
│
├── scripts/                           # Helper Scripts
│   └── test-local.ps1                # Windows PowerShell test script
│
├── cloudbuild-backend.yaml           # Cloud Build config for backend
├── cloudbuild-frontend.yaml          # Cloud Build config for frontend
│
├── .gitignore                        # Git ignore patterns
├── .dockerignore                     # Docker ignore patterns
│
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick start guide
├── SETUP.md                          # Detailed setup instructions
├── GCP-DEPLOYMENT.md                 # GCP deployment guide
└── PROJECT-STRUCTURE.md              # This file

```

## Component Breakdown

### Frontend (React + TypeScript)
**Location**: `/frontend`

**Purpose**: User interface layer

**Key Files**:
- `App.tsx` - Main UI component with Hello World display
- `App.css` - Beautiful gradient styling
- `index.tsx` - React application entry point
- `package.json` - Dependencies (React 18, TypeScript, Axios)

**Port**: 3000 (local) / 80 (Docker/GCP)

**Technology**:
- React 18 with TypeScript
- Axios for API calls
- Modern CSS with gradients and animations
- Responsive design

---

### Backend (NestJS)
**Location**: `/backend`

**Purpose**: API service layer

**Key Files**:
- `main.ts` - Application bootstrap with CORS
- `app.module.ts` - Root module with TypeORM configuration
- `app.controller.ts` - REST API endpoints (`/api/hello`, `/api/health`)
- `app.service.ts` - Business logic for database queries
- `entities/hello-world.entity.ts` - TypeORM entity for hello_world table

**Port**: 3001 (local) / 8080 (GCP)

**Technology**:
- NestJS 10
- TypeORM for database ORM
- PostgreSQL driver (pg)
- Express.js

---

### Database (PostgreSQL)
**Location**: `/database`

**Purpose**: Data persistence layer

**Key Files**:
- `init.sql` - Database initialization script

**Schema**:
```sql
hello_world (
  id SERIAL PRIMARY KEY,
  message VARCHAR(255),
  created_at TIMESTAMP
)
```

**Port**: 5432

**Technology**:
- PostgreSQL 15

---

### Docker Configurations
**Location**: `/docker`

**Purpose**: Container orchestration

**Files**:

1. **Dockerfile.backend**
   - Multi-stage build for NestJS
   - Node 18 Alpine base image
   - Production optimized

2. **Dockerfile.frontend**
   - Multi-stage build for React
   - Nginx Alpine for serving static files
   - Build-time environment variables

3. **nginx.conf**
   - React Router support
   - Static asset caching
   - Gzip compression

4. **docker-compose.local.yml**
   - 3 services: frontend, backend, postgres
   - Local development network
   - Volume mounts for data persistence
   - Health checks

5. **docker-compose.demo.yml**
   - 2 services: frontend, backend
   - Connects to Cloud SQL (external DB)
   - Production environment variables

---

### Cloud Build Configurations
**Location**: Root directory

**Purpose**: CI/CD pipeline for GCP

**Files**:

1. **cloudbuild-backend.yaml**
   - Builds backend Docker image
   - Pushes to Google Container Registry
   - Triggered on GitHub push to main

2. **cloudbuild-frontend.yaml**
   - Builds frontend Docker image
   - Accepts API_URL as build argument
   - Pushes to Google Container Registry

---

### Helper Scripts
**Location**: `/scripts`

**Purpose**: Development automation

**Files**:
- `test-local.ps1` - PowerShell script for Windows
  - Checks Docker status
  - Verifies environment setup
  - Tests all services
  - Provides diagnostic information

---

### Documentation
**Location**: Root directory

**Files**:

1. **README.md**
   - Project overview
   - Quick start instructions
   - Technology stack
   - Repository information

2. **QUICKSTART.md**
   - 5-minute setup guide
   - Essential commands
   - Troubleshooting tips

3. **SETUP.md**
   - Detailed setup instructions
   - Architecture diagrams
   - Development workflows
   - Comprehensive troubleshooting

4. **GCP-DEPLOYMENT.md**
   - Cloud SQL setup
   - Cloud Build configuration
   - Cloud Run deployment
   - Monitoring and security

5. **PROJECT-STRUCTURE.md**
   - This file
   - Complete project layout
   - Component explanations

---

## Data Flow

### Request Flow (Hello World)

```
1. User opens browser → http://localhost:3000

2. React App (frontend/src/App.tsx)
   ↓
   useEffect() → fetchHelloWorld()
   ↓
   axios.get('http://localhost:3001/api/hello')

3. NestJS API (backend/src/app.controller.ts)
   ↓
   @Get('hello') → AppService.getHelloWorld()

4. Service (backend/src/app.service.ts)
   ↓
   helloWorldRepository.findOne({ where: { id: 1 } })

5. PostgreSQL Database
   ↓
   SELECT * FROM hello_world WHERE id = 1;
   ↓
   Returns: { id: 1, message: "Hello World from DevFest PTA 2025! 🚀" }

6. Response flows back:
   Database → Service → Controller → API Response → Frontend → User
```

---

## Environment Variables

### Local Development (.env)
```
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

### GCP Demo (.env.demo)
```
DB_HOST=<CLOUD_SQL_IP>
DB_PORT=5432
DB_NAME=devfest_db
DB_USER=devfest_user
DB_PASSWORD=DevF3st123-pluto-is-plan3t
BACKEND_PORT=8080
REACT_APP_API_URL=<GCP_BACKEND_URL>
NODE_ENV=production
```

---

## Docker Containers

### Local Setup

1. **devfest-postgres-local**
   - Image: postgres:15-alpine
   - Port: 5432
   - Volume: postgres_data
   - Initializes with: database/init.sql

2. **devfest-backend-local**
   - Image: Built from docker/Dockerfile.backend
   - Port: 3001
   - Depends on: postgres
   - Environment: Development

3. **devfest-frontend-local**
   - Image: Built from docker/Dockerfile.frontend
   - Port: 3000 (mapped to 80 in container)
   - Depends on: backend
   - Serves: Static React build via Nginx

---

## Network Architecture

### Local Docker Network

```
devfest-network (bridge)
├── postgres (hostname: postgres)
├── backend (hostname: backend)
└── frontend (hostname: frontend)
```

Services communicate using container hostnames.

External access via localhost mapped ports.

---

## Key Technologies & Versions

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend Framework | React | 18.2.0 |
| Frontend Language | TypeScript | 4.9.5 |
| Backend Framework | NestJS | 10.0.0 |
| Backend Language | TypeScript | 5.1.3 |
| Database | PostgreSQL | 15 |
| ORM | TypeORM | 0.3.17 |
| HTTP Client | Axios | 1.6.0 |
| Container | Docker | Latest |
| Web Server | Nginx | Alpine |
| Node Runtime | Node.js | 18 Alpine |

---

## Next Phase: Recruitment Application

After Hello World validation, the structure will expand:

```
backend/src/
├── modules/
│   ├── applications/
│   │   ├── entities/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── dto/
│   └── users/
│       ├── entities/
│       ├── controllers/
│       └── services/
└── common/
    ├── guards/
    └── decorators/

frontend/src/
├── components/
│   ├── ApplicantView/
│   ├── RecruiterView/
│   └── shared/
├── services/
├── hooks/
└── types/
```

---

## File Ownership Summary

**Configuration Files**: 8
- Docker configs, environment templates, ignore files

**Frontend Files**: 7
- React components, styles, TypeScript config

**Backend Files**: 8
- NestJS modules, controllers, services, entities

**Database Files**: 1
- Initialization script

**Documentation Files**: 5
- README, guides, this structure doc

**Scripts**: 1
- PowerShell test automation

**Total Files**: ~30 core files

---

For setup instructions, see [QUICKSTART.md](./QUICKSTART.md)

