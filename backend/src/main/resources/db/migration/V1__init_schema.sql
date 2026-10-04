-- Flyway Migration V1: Initialize RepoMind Database Schema

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    github_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS repositories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    github_url VARCHAR(512) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    default_branch VARCHAR(64) DEFAULT 'main',
    analysis_status VARCHAR(64) DEFAULT 'PENDING',
    is_demo BOOLEAN DEFAULT FALSE,
    local_path VARCHAR(1024),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS repository_files (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    path VARCHAR(1024) NOT NULL,
    language VARCHAR(64),
    size_bytes BIGINT DEFAULT 0,
    line_count INT DEFAULT 0,
    content TEXT,
    content_hash VARCHAR(128)
);

CREATE TABLE IF NOT EXISTS code_symbols (
    id BIGSERIAL PRIMARY KEY,
    file_id BIGINT NOT NULL REFERENCES repository_files(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    start_line INT NOT NULL,
    end_line INT NOT NULL
);

CREATE TABLE IF NOT EXISTS dependencies (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    source VARCHAR(512) NOT NULL,
    target VARCHAR(512) NOT NULL,
    dependency_type VARCHAR(64) DEFAULT 'IMPORT'
);

CREATE TABLE IF NOT EXISTS security_findings (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    file_path VARCHAR(1024) NOT NULL,
    line_number INT NOT NULL,
    severity VARCHAR(32) NOT NULL,
    category VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS technical_debt_metrics (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    debt_score INT NOT NULL,
    remediation_hours DOUBLE PRECISION DEFAULT 0.0,
    total_todos INT DEFAULT 0,
    high_complexity_modules INT DEFAULT 0,
    oversized_files INT DEFAULT 0,
    explanation TEXT
);

CREATE TABLE IF NOT EXISTS git_commits (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    commit_hash VARCHAR(64) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    message TEXT,
    committed_at VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS architecture_nodes (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    node_id VARCHAR(512) NOT NULL,
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(64) NOT NULL,
    path VARCHAR(1024),
    description TEXT
);

CREATE TABLE IF NOT EXISTS architecture_edges (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    source_node_id VARCHAR(512) NOT NULL,
    target_node_id VARCHAR(512) NOT NULL,
    label VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS chat_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    repository_id BIGINT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'Codebase Exploration',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    sources_json TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documentation (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    doc_type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
