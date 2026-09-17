CREATE TABLE app_users (
    email VARCHAR(254) PRIMARY KEY,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
    token VARCHAR(100) PRIMARY KEY,
    user_email VARCHAR(254) NOT NULL REFERENCES app_users(email) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE TABLE analyses (
    id UUID PRIMARY KEY,
    user_email VARCHAR(254) NOT NULL REFERENCES app_users(email) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    location VARCHAR(500) NOT NULL,
    radius DOUBLE PRECISION NOT NULL,
    analysis_result JSON NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analyses_user_created_at ON analyses(user_email, created_at DESC);
