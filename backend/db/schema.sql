-- SAHAYAK AI – Citizen Benefits Platform Database Schema (PostgreSQL)

DROP TABLE IF EXISTS application_status_history CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS partner_eligibility CASCADE;
DROP TABLE IF EXISTS partner_schemes CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS scheme_benefits CASCADE;
DROP TABLE IF EXISTS scheme_rules CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS user_queries CASCADE;
DROP TABLE IF EXISTS schemes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table (Citizens / Applicants)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    age INTEGER DEFAULT 30,
    gender VARCHAR(20) DEFAULT 'General',
    occupation VARCHAR(100) DEFAULT 'Farmer',
    category VARCHAR(50) DEFAULT 'General', -- General, OBC, SC, ST, EWS, Minority, Women
    annual_income NUMERIC(12, 2) DEFAULT 200000,
    district VARCHAR(100) DEFAULT 'Pune',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    landholding_acres NUMERIC(6, 2) DEFAULT 0,
    is_differently_abled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Schemes Table (Central and State Government Schemes)
CREATE TABLE schemes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    name_mr VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    department VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    description_hi TEXT,
    description_mr TEXT,
    max_benefit NUMERIC(12, 2) DEFAULT 0,
    subsidy_pct NUMERIC(5, 2) DEFAULT 0,
    interest_rate NUMERIC(5, 2) DEFAULT 0,
    min_age INTEGER DEFAULT 18,
    max_age INTEGER DEFAULT 70,
    max_income NUMERIC(12, 2) DEFAULT 1000000,
    is_marginalized_entrepreneur BOOLEAN DEFAULT FALSE,
    marginalized_focus VARCHAR(255),
    target_occupations JSONB,
    required_documents JSONB,
    application_process JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Scheme Rules Table (Deterministic Rule Engine)
CREATE TABLE scheme_rules (
    id SERIAL PRIMARY KEY,
    scheme_id INTEGER REFERENCES schemes(id) ON DELETE CASCADE,
    rule_type VARCHAR(50) NOT NULL,
    rule_key VARCHAR(50) NOT NULL,
    operator VARCHAR(10) NOT NULL,
    rule_value TEXT NOT NULL,
    description VARCHAR(255) NOT NULL,
    description_hi VARCHAR(255),
    description_mr VARCHAR(255),
    is_mandatory BOOLEAN DEFAULT TRUE
);

-- 4. Scheme Benefits Table
CREATE TABLE scheme_benefits (
    id SERIAL PRIMARY KEY,
    scheme_id INTEGER REFERENCES schemes(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    monetary_val NUMERIC(12, 2) DEFAULT 0
);

-- 5. Partners Table (Channel Partners / Financial Institutions in Pune & Maharashtra)
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    district VARCHAR(100) DEFAULT 'Pune',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    address TEXT NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    fund_available NUMERIC(14, 2) NOT NULL,
    npa_percentage NUMERIC(5, 2) NOT NULL,
    overdue_rate NUMERIC(5, 2) NOT NULL,
    is_authorized BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 1) DEFAULT 4.5,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(100),
    is_demo_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Partner Schemes
CREATE TABLE partner_schemes (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    scheme_id INTEGER REFERENCES schemes(id) ON DELETE CASCADE,
    allocated_quota INTEGER DEFAULT 500,
    processed_count INTEGER DEFAULT 120
);

-- 7. Partner Eligibility Logs (Calculated 6-factor Scores)
CREATE TABLE partner_eligibility (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    scheme_id INTEGER REFERENCES schemes(id) ON DELETE CASCADE,
    user_id INTEGER,
    total_score NUMERIC(5, 2) NOT NULL,
    scheme_compatibility_score NUMERIC(5, 2) NOT NULL,
    location_proximity_score NUMERIC(5, 2) NOT NULL,
    fund_availability_score NUMERIC(5, 2) NOT NULL,
    npa_health_score NUMERIC(5, 2) NOT NULL,
    overdue_rate_score NUMERIC(5, 2) NOT NULL,
    authorization_score NUMERIC(5, 2) NOT NULL,
    reasons JSONB,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Applications Table
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    application_no VARCHAR(64) UNIQUE NOT NULL,
    user_id INTEGER,
    scheme_id INTEGER REFERENCES schemes(id),
    partner_id INTEGER REFERENCES partners(id),
    applicant_name VARCHAR(150) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    applicant_district VARCHAR(100) DEFAULT 'Pune',
    applicant_occupation VARCHAR(100),
    requested_amount NUMERIC(12, 2) NOT NULL,
    subsidy_amount NUMERIC(12, 2) DEFAULT 0,
    tenure_months INTEGER DEFAULT 36,
    interest_rate NUMERIC(5, 2) DEFAULT 7.5,
    monthly_emi NUMERIC(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Submitted',
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Application Status History
CREATE TABLE application_status_history (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Recommendations Table
CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    profile_data JSONB,
    scheme_id INTEGER REFERENCES schemes(id),
    match_score NUMERIC(5, 2) NOT NULL,
    is_eligible BOOLEAN NOT NULL,
    eligibility_status VARCHAR(50) NOT NULL,
    rule_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. User Queries Table
CREATE TABLE user_queries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    query_text TEXT NOT NULL,
    intent VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    response_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
