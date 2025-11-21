-- Migration 001: Create applications and related tables
-- DevFest PTA 2025 - Recruitment Application

-- Create hello_world table (for demo/testing)
CREATE TABLE IF NOT EXISTS hello_world (
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial hello world message
INSERT INTO hello_world (message) 
VALUES ('Hello World from DevFest PTA 2025! 🚀')
ON CONFLICT DO NOTHING;

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    candidate_name VARCHAR(255) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    candidate_full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    cv_filename VARCHAR(500),
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'submitted',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(candidate_email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Insert sample data for testing
INSERT INTO applications (candidate_name, candidate_email, candidate_full_name, position, cv_filename, cover_letter, status)
VALUES 
    ('john.doe', 'john.doe@example.com', 'John Doe', 'Senior Developer', 'john_doe_cv.pdf', 'I am excited to apply for this position...', 'submitted'),
    ('jane.smith', 'jane.smith@example.com', 'Jane Smith', 'DevOps Engineer', 'jane_smith_cv.pdf', 'With 5 years of experience...', 'under_review'),
    ('bob.wilson', 'bob.wilson@example.com', 'Bob Wilson', 'Frontend Developer', 'bob_wilson_cv.pdf', 'Passionate about React...', 'interview')
ON CONFLICT DO NOTHING;

