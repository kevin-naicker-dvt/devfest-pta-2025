# Database Migrations

This directory contains SQL migration scripts for the DevFest PTA 2025 application.

## Migration Files

- `001_create_applications.sql` - Creates the applications table and indexes

## Running Migrations

### Local Development (Docker)
Migrations are automatically applied when the database initializes.

### GCP Cloud SQL
Run migrations manually after database creation:

```bash
# Connect to Cloud SQL
gcloud sql connect devfest-postgres --user=devfest_user --database=devfest_db

# Run migration
\i 001_create_applications.sql
```

Or using psql:

```bash
psql -h CLOUD_SQL_IP -U devfest_user -d devfest_db -f database/migrations/001_create_applications.sql
```

## Migration Naming Convention

`{number}_{description}.sql`

Example: `001_create_applications.sql`

## Status Values

Applications can have the following statuses:
- `submitted` - Initial submission
- `under_review` - Recruiter is reviewing
- `interview` - Scheduled for interview
- `rejected` - Application rejected
- `accepted` - Application accepted

