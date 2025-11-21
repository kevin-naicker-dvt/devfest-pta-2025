-- DevFest PTA 2025 - Database Initialization Script
-- This script initializes the database with the hello_world table

-- Create hello_world table
CREATE TABLE IF NOT EXISTS hello_world (
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial hello world message
INSERT INTO hello_world (message) 
VALUES ('Hello World from DevFest PTA 2025! 🚀')
ON CONFLICT DO NOTHING;

-- Verify the insertion
SELECT * FROM hello_world;

