# DevFest PTA 2025 - Recruitment Application Features

## 🎉 Application Overview

The DevFest Recruitment Application is a complete 3-tier cloud-native demo showcasing modern web development practices for Google Cloud Platform deployment.

## ✅ Implemented Features

### 1. **Role-Based UI (Demo Mode)**

- **Applicant Role** 👤
  - Submit job applications
  - View application status
  - Track application history
  
- **Recruiter Role** 👔
  - View all applications
  - Review candidate details
  - Update application status
  - Add notes to applications

**How it works**: Click the role switcher to toggle between Applicant and Recruiter views. No real authentication required - perfect for demos!

### 2. **Job Application Submission**

**Location**: Applicant View → "Apply for Job"

**Features**:
- Pre-filled candidate information (name, email, full name)
- Position selection dropdown (8 positions available)
- **Simulated CV Upload** 📄
  - Click "Simulate CV Upload" button
  - Generates a mock filename (e.g., `john_doe_cv_1234567890.pdf`)
  - No actual file upload - perfect for demos!
- Optional cover letter text area
- Form validation (position and CV required)
- Success feedback with redirect to "My Applications"

**Available Positions**:
- Senior Developer
- Frontend Developer
- Backend Developer
- DevOps Engineer
- Full Stack Developer
- Mobile Developer
- Data Engineer
- QA Engineer

### 3. **My Applications View**

**Location**: Applicant View → "My Applications"

**Features**:
- Grid display of all user's applications
- Color-coded status badges:
  - 📤 Submitted (Blue)
  - 👀 Under Review (Orange)
  - 🗓️ Interview (Purple)
  - ✅ Accepted (Green)
  - ❌ Rejected (Red)
- Shows: Position, Applied Date, CV filename, Recruiter notes
- Real-time status updates
- Empty state message for new users

### 4. **Recruiter Dashboard**

**Location**: Recruiter View → "Dashboard"

**Features**:
- **Statistics Cards**:
  - Total Applications
  - New Submissions
  - Under Review
  - Interviews Scheduled
  
- **Applications Queue Table**:
  - Candidate name and email
  - Position applied for
  - Application date
  - Current status
  - View button for details

- **Application Detail Modal**:
  - Full candidate information
  - CV filename
  - Cover letter (if provided)
  - Status dropdown selector
  - Notes text area
  - Save changes functionality

### 5. **Backend API Endpoints**

All endpoints are prefixed with `/api`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/hello` | GET | Hello World test endpoint |
| `/api/health` | GET | Health check endpoint |
| `/api/applications` | POST | Submit new application |
| `/api/applications` | GET | Get all applications (or filter by email) |
| `/api/applications/:id` | GET | Get specific application |
| `/api/applications/:id` | PUT | Update application status/notes |
| `/api/applications/stats/summary` | GET | Get application statistics |

### 6. **Database Schema**

**Tables**:

1. **hello_world**
   - `id` (Serial Primary Key)
   - `message` (VARCHAR 255)
   - `created_at` (Timestamp)

2. **applications**
   - `id` (Serial Primary Key)
   - `candidate_name` (VARCHAR 255)
   - `candidate_email` (VARCHAR 255)
   - `candidate_full_name` (VARCHAR 255)
   - `position` (VARCHAR 255)
   - `cv_filename` (VARCHAR 500)
   - `cover_letter` (TEXT)
   - `status` (VARCHAR 50)
   - `notes` (TEXT)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

**Indexes**:
- `idx_applications_email` - Fast lookup by email
- `idx_applications_status` - Fast filtering by status

**Sample Data**: 3 sample applications are pre-loaded for testing

## 🎭 Demo User Accounts

### Applicant Account
- **Name**: john.doe
- **Email**: john.doe@example.com
- **Full Name**: John Doe
- **Role**: Applicant

### Recruiter Account
- **Name**: jane.recruiter
- **Email**: jane.recruiter@company.com
- **Full Name**: Jane Recruiter
- **Role**: Recruiter

## 🚀 How to Test the Application

### 1. Start as Applicant

1. Open http://localhost:3000
2. Click "Start Demo" or "Login (Demo)"
3. You'll be logged in as John Doe (Applicant)
4. Click "Apply for Job"
5. Select a position (e.g., "Frontend Developer")
6. Click "Simulate CV Upload" (generates mock filename)
7. Optionally add a cover letter
8. Click "Submit Application"
9. View your submission in "My Applications"

### 2. Switch to Recruiter

1. Click "Switch to Recruiter" in top navigation
2. You're now logged in as Jane Recruiter
3. Click "Open Dashboard"
4. See statistics and all applications
5. Click "View" on any application
6. Change status (e.g., from "Submitted" to "Under Review")
7. Add notes (e.g., "Great experience, schedule interview")
8. Click "Save Changes"

### 3. Switch Back to Applicant

1. Click "Switch to Applicant"
2. Go to "My Applications"
3. See the updated status and recruiter notes!

## 📊 Application Status Workflow

```
Submitted → Under Review → Interview → Accepted/Rejected
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Gradient Design**: Purple gradient theme
- **Smooth Animations**: Hover effects and transitions
- **Color-Coded Status**: Visual status identification
- **Modal Dialogs**: Clean interaction patterns
- **Empty States**: Helpful messages for new users
- **Loading States**: Proper feedback during operations
- **Error Handling**: User-friendly error messages

## 🗄️ Database Migrations

**Location**: `database/migrations/001_create_applications.sql`

**Purpose**: Creates all necessary tables and sample data

**Running Manually** (for GCP):
```bash
psql -h CLOUD_SQL_IP -U devfest_user -d devfest_db -f database/migrations/001_create_applications.sql
```

**Features**:
- Idempotent (can be run multiple times safely)
- Includes sample data for testing
- Creates indexes for performance
- Compatible with PostgreSQL 15

## 🐳 Docker Configuration

**Local Development**: `docker/docker-compose.local.yml`
- PostgreSQL with migrations auto-applied
- NestJS backend
- React frontend with Nginx

**GCP Demo**: `docker/docker-compose.demo.yml`
- Backend connects to Cloud SQL
- Frontend configured with GCP backend URL

## 📝 Key Design Decisions

1. **No Real Authentication**: Demo-friendly role switcher instead
2. **Simulated CV Upload**: No file storage needed for demos
3. **Sample Data**: Pre-loaded applications for immediate testing
4. **Migration Scripts**: Database changes tracked for GCP deployment
5. **TypeORM with Manual Migrations**: `synchronize: false` for production safety
6. **Separate Tables**: hello_world for architecture test, applications for features

## 🎯 Next Steps

1. ✅ Local architecture validated
2. ✅ Recruitment features implemented
3. ⏭️ Deploy to Google Cloud Platform
4. ⏭️ Setup Cloud Build CI/CD pipeline
5. ⏭️ Configure Cloud SQL
6. ⏭️ Deploy to Cloud Run

## 🔗 Related Documentation

- [README.md](./README.md) - Project overview
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [GCP-DEPLOYMENT.md](./GCP-DEPLOYMENT.md) - GCP deployment guide
- [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) - Code organization

---

**Built for DevFest PTA 2025** - Demonstrating modern cloud-native architecture with Google Cloud Platform

