-- RepoMind Database Initialization Script
-- Initializes extensions and sets up default database structure

-- Attempt to enable pgvector if available
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table definitions are automatically managed by SQLAlchemy at application startup,
-- but this script provides explicit fallback schema initialization for Docker containers.

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    github_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS repositories (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    github_url VARCHAR(512) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    default_branch VARCHAR(64) DEFAULT 'main',
    analysis_status VARCHAR(64) DEFAULT 'pending',
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    repository_id INT REFERENCES repositories(id) ON DELETE CASCADE,
    path VARCHAR(1024) NOT NULL,
    language VARCHAR(64),
    size INT DEFAULT 0,
    line_count INT DEFAULT 0,
    content TEXT,
    content_hash VARCHAR(128)
);

CREATE TABLE IF NOT EXISTS symbols (
    id SERIAL PRIMARY KEY,
    file_id INT REFERENCES files(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    start_line INT NOT NULL,
    end_line INT NOT NULL
);

CREATE TABLE IF NOT EXISTS dependencies (
    id SERIAL PRIMARY KEY,
    repository_id INT REFERENCES repositories(id) ON DELETE CASCADE,
    source VARCHAR(512) NOT NULL,
    target VARCHAR(512) NOT NULL,
    dependency_type VARCHAR(64) DEFAULT 'import'
);

CREATE TABLE IF NOT EXISTS security_findings (
    id SERIAL PRIMARY KEY,
    repository_id INT REFERENCES repositories(id) ON DELETE CASCADE,
    file VARCHAR(1024) NOT NULL,
    line INT NOT NULL,
    severity VARCHAR(32) NOT NULL,
    category VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS analyses (
    id SERIAL PRIMARY KEY,
    repository_id INT REFERENCES repositories(id) ON DELETE CASCADE,
    metric VARCHAR(128) NOT NULL,
    value JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    repository_id INT REFERENCES repositories(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INT REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    sources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
