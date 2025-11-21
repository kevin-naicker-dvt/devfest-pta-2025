-- DevFest PTA 2025 - Database Initialization Script
-- Note: TypeORM will create and manage the hello_world table with synchronize: true
-- Run migrations for other tables

-- Run migration scripts
\i /docker-entrypoint-initdb.d/migrations/001_create_applications.sql

-- Database initialization complete
SELECT 'Database initialized successfully!' AS status;

