-- ReelByte Database Initialization Script
-- PostgreSQL 17 - Core MVP Tables
-- This script creates the essential database schema for the ReelByte platform

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search enhancements
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable query statistics
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Enable GIN index support
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ============================================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('creator', 'client', 'both')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted', 'pending_verification')),

    -- Verification
    email_verified BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,

    -- Activity tracking
    last_login_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================================================
-- 2. CREATOR PROFILES
-- ============================================================================

CREATE TABLE creator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    tagline VARCHAR(200),
    bio TEXT,
    profile_image_url TEXT,
    cover_image_url TEXT,
    portfolio_video_url TEXT,

    -- Professional Info
    years_of_experience INTEGER,
    hourly_rate DECIMAL(10, 2),
    availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
    response_time_hours INTEGER,

    -- Statistics (denormalized for performance)
    total_jobs_completed INTEGER DEFAULT 0,
    total_earnings DECIMAL(12, 2) DEFAULT 0,
    success_rate DECIMAL(5, 2) DEFAULT 0,
    on_time_delivery_rate DECIMAL(5, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,

    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verification_level VARCHAR(20) CHECK (verification_level IN ('none', 'basic', 'pro', 'elite')),
    verified_at TIMESTAMPTZ,

    -- Social Links
    instagram_handle VARCHAR(100),
    tiktok_handle VARCHAR(100),
    youtube_channel VARCHAR(255),
    website_url VARCHAR(255),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for creator_profiles
CREATE INDEX idx_creator_profiles_user_id ON creator_profiles(user_id);
CREATE INDEX idx_creator_profiles_availability ON creator_profiles(availability_status);
CREATE INDEX idx_creator_profiles_verified ON creator_profiles(is_verified);
CREATE INDEX idx_creator_profiles_rating ON creator_profiles(average_rating DESC);

-- ============================================================================
-- 3. CLIENT PROFILES
-- ============================================================================

CREATE TABLE client_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    company_logo_url TEXT,
    industry VARCHAR(100),
    company_size VARCHAR(50) CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
    website_url VARCHAR(255),
    description TEXT,

    -- Statistics
    total_jobs_posted INTEGER DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,

    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    payment_verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for client_profiles
CREATE INDEX idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX idx_client_profiles_verified ON client_profiles(is_verified);

-- ============================================================================
-- 4. GIGS (SERVICE LISTINGS)
-- ============================================================================

CREATE TABLE gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    description TEXT NOT NULL,

    -- Pricing Tiers (Basic, Standard, Premium)
    basic_price DECIMAL(10, 2) NOT NULL,
    basic_description TEXT,
    basic_delivery_days INTEGER NOT NULL,
    basic_revisions INTEGER DEFAULT 0,

    standard_price DECIMAL(10, 2),
    standard_description TEXT,
    standard_delivery_days INTEGER,
    standard_revisions INTEGER,

    premium_price DECIMAL(10, 2),
    premium_description TEXT,
    premium_delivery_days INTEGER,
    premium_revisions INTEGER,

    -- Details
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    video_type VARCHAR(50), -- Reel, Short, TikTok, YouTube Short, etc.

    -- Media
    thumbnail_url TEXT,
    video_samples JSONB, -- Array of video URLs

    -- Requirements
    requirements TEXT,

    -- Stats
    view_count INTEGER DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'deleted')),

    -- SEO
    search_tags TEXT[], -- PostgreSQL array for tags

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Indexes for gigs
CREATE INDEX idx_gigs_creator_id ON gigs(creator_profile_id);
CREATE INDEX idx_gigs_status ON gigs(status);
CREATE INDEX idx_gigs_category ON gigs(category);
CREATE INDEX idx_gigs_slug ON gigs(slug);
CREATE INDEX idx_gigs_published_at ON gigs(published_at DESC) WHERE status = 'active';
CREATE INDEX idx_gigs_search_tags ON gigs USING GIN(search_tags);
CREATE INDEX idx_gigs_full_text ON gigs USING GIN(to_tsvector('english', title || ' ' || description));

-- ============================================================================
-- 5. PROJECTS (JOB POSTINGS)
-- ============================================================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_profile_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,

    -- Project Details
    category VARCHAR(50) NOT NULL,
    video_type VARCHAR(50),
    video_duration_preference VARCHAR(50),
    platform_preference VARCHAR(50),

    -- Budget
    budget_type VARCHAR(20) CHECK (budget_type IN ('fixed', 'hourly', 'range')),
    budget_min DECIMAL(10, 2),
    budget_max DECIMAL(10, 2),

    -- Timeline
    deadline_date DATE,
    estimated_duration_days INTEGER,

    -- Requirements
    required_skills TEXT[],
    experience_level VARCHAR(20) CHECK (experience_level IN ('entry', 'intermediate', 'expert', 'any')),

    -- Attachments
    attachments JSONB, -- Array of file URLs

    -- Stats
    view_count INTEGER DEFAULT 0,
    proposal_count INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled', 'closed')),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ
);

-- Indexes for projects
CREATE INDEX idx_projects_client_id ON projects(client_profile_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_published_at ON projects(published_at DESC) WHERE status = 'open';
CREATE INDEX idx_projects_required_skills ON projects USING GIN(required_skills);
CREATE INDEX idx_projects_full_text ON projects USING GIN(to_tsvector('english', title || ' ' || description));

-- ============================================================================
-- 6. PROPOSALS
-- ============================================================================

CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,

    -- Proposal Details
    cover_letter TEXT NOT NULL,
    proposed_budget DECIMAL(10, 2) NOT NULL,
    proposed_timeline_days INTEGER NOT NULL,

    -- Attachments
    attachments JSONB,
    portfolio_samples JSONB, -- References to portfolio_items

    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ
);

-- Indexes for proposals
CREATE INDEX idx_proposals_project_id ON proposals(project_id);
CREATE INDEX idx_proposals_creator_id ON proposals(creator_profile_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE UNIQUE INDEX idx_proposals_unique ON proposals(project_id, creator_profile_id);

-- ============================================================================
-- 7. CONTRACTS
-- ============================================================================

CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
    gig_id UUID REFERENCES gigs(id) ON DELETE SET NULL, -- For gig-based orders

    client_profile_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE RESTRICT,
    creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE RESTRICT,

    -- Contract Details
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    scope_of_work TEXT NOT NULL,

    -- Financials
    total_amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    creator_payout DECIMAL(10, 2) NOT NULL,

    -- Timeline
    start_date DATE NOT NULL,
    deadline_date DATE NOT NULL,
    estimated_hours INTEGER,

    -- Deliverables
    deliverable_description TEXT,
    revision_count INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'pending_acceptance' CHECK (status IN (
        'pending_acceptance', 'active', 'in_review',
        'revision_requested', 'completed', 'cancelled', 'disputed'
    )),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- Indexes for contracts
CREATE INDEX idx_contracts_client_id ON contracts(client_profile_id);
CREATE INDEX idx_contracts_creator_id ON contracts(creator_profile_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_project_id ON contracts(project_id);
CREATE INDEX idx_contracts_deadline ON contracts(deadline_date);

-- ============================================================================
-- 8. REVIEWS & RATINGS
-- ============================================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,

    reviewer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewer_type VARCHAR(10) CHECK (reviewer_type IN ('client', 'creator')),

    -- Rating
    overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),

    -- Detailed Ratings (optional)
    communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
    quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
    professionalism_rating INTEGER CHECK (professionalism_rating BETWEEN 1 AND 5),
    value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),

    -- Review Text
    title VARCHAR(200),
    comment TEXT,

    -- Response
    response_text TEXT,
    response_at TIMESTAMPTZ,

    -- Status
    is_public BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    flagged BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for reviews
CREATE INDEX idx_reviews_contract_id ON reviews(contract_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_user_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_user_id);
CREATE INDEX idx_reviews_rating ON reviews(overall_rating);
CREATE UNIQUE INDEX idx_reviews_unique ON reviews(contract_id, reviewer_user_id);

-- ============================================================================
-- 9. TRANSACTIONS
-- ============================================================================

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Parties
    payer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    payee_user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Related Entities
    contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,

    -- Transaction Details
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN (
        'payment', 'refund', 'payout', 'escrow_hold', 'escrow_release',
        'platform_fee', 'tip', 'adjustment'
    )),

    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    platform_fee DECIMAL(10, 2) DEFAULT 0,
    processing_fee DECIMAL(10, 2) DEFAULT 0,
    net_amount DECIMAL(10, 2) NOT NULL,

    -- Payment Provider
    payment_provider VARCHAR(50),
    provider_transaction_id VARCHAR(255),

    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'
    )),

    -- Metadata
    description TEXT,
    metadata JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    error_message TEXT
);

-- Indexes for transactions
CREATE INDEX idx_transactions_payer_id ON transactions(payer_user_id);
CREATE INDEX idx_transactions_payee_id ON transactions(payee_user_id);
CREATE INDEX idx_transactions_contract_id ON transactions(contract_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- ============================================================================
-- 10. MESSAGING SYSTEM
-- ============================================================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Related Entity (optional)
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,

    -- Conversation Type
    conversation_type VARCHAR(20) DEFAULT 'direct' CHECK (conversation_type IN ('direct', 'project_inquiry', 'contract_discussion')),

    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for conversations
CREATE INDEX idx_conversations_project_id ON conversations(project_id);
CREATE INDEX idx_conversations_contract_id ON conversations(contract_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Status
    is_muted BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,

    -- Read Status
    last_read_at TIMESTAMPTZ,
    unread_count INTEGER DEFAULT 0,

    joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for conversation_participants
CREATE INDEX idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE UNIQUE INDEX idx_conversation_participants_unique ON conversation_participants(conversation_id, user_id);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Content
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'video', 'image', 'system')),
    content TEXT NOT NULL,

    -- Attachments
    attachments JSONB,

    -- Status
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    edited_at TIMESTAMPTZ
);

-- Indexes for messages
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender_id ON messages(sender_user_id);

-- ============================================================================
-- 11. NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Notification Details
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,

    -- Related Entities
    related_entity_type VARCHAR(50),
    related_entity_id UUID,

    -- Action
    action_url TEXT,

    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON gigs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA / SEED DATA (Optional)
-- ============================================================================

-- You can add initial data here if needed
-- For example, default categories, platform settings, etc.

-- ============================================================================
-- DATABASE SETUP COMPLETE
-- ============================================================================

-- Grant appropriate permissions to application user (if needed)
-- CREATE ROLE reelbyte_app WITH LOGIN PASSWORD 'your_password_here';
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO reelbyte_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO reelbyte_app;
