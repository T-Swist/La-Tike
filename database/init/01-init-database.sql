-- La-Tike Database Initialization Script
-- This script creates the initial database structure and extensions

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_events_search ON events USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_users_search ON users USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || email));

-- Create functions for timestamp handling
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function for soft delete
CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deleted_at = CURRENT_TIMESTAMP;
    NEW.is_deleted = true;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function for ticket code generation
CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ticket_code = 'LAT-' || to_char(CURRENT_DATE, 'YYYY') || '-' || 
                      lpad(nextval('ticket_code_seq')::text, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS ticket_code_seq START 1;

-- Create audit table for tracking changes
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(255) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create trigger function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (table_name, record_id, action, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create notification function for real-time updates
CREATE OR REPLACE FUNCTION notify_event_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('event_changes', 
        json_build_object(
            'table', TG_TABLE_NAME,
            'action', TG_OP,
            'id', COALESCE(NEW.id, OLD.id),
            'data', COALESCE(row_to_json(NEW), row_to_json(OLD))
        )::text
    );
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create view for active events
CREATE OR REPLACE VIEW active_events AS
SELECT * FROM events 
WHERE is_deleted = false 
AND status IN ('upcoming', 'ongoing')
AND date >= CURRENT_DATE;

-- Create view for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.role,
    COUNT(DISTINCT CASE WHEN t.status = 'valid' THEN t.id END) as valid_tickets,
    COUNT(DISTINCT CASE WHEN e.host_id = u.id AND e.status = 'completed' THEN e.id END) as completed_events,
    COALESCE(SUM(CASE WHEN t.status = 'valid' AND t.price > 0 THEN t.price END), 0) as total_spent,
    COALESCE(SUM(CASE WHEN e.host_id = u.id AND e.status = 'completed' THEN e.total_revenue END), 0) as total_earned
FROM users u
LEFT JOIN tickets t ON u.id = t.user_id AND t.is_deleted = false
LEFT JOIN events e ON u.id = e.host_id AND e.is_deleted = false
GROUP BY u.id, u.first_name, u.last_name, u.email, u.role;

-- Grant permissions to the latike user
GRANT USAGE ON SCHEMA public TO latike;
GRANT CREATE ON SCHEMA public TO latike;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO latike;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO latike;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO latike;

-- Create sample data for testing (optional)
-- This will be replaced by actual seed data in production
DO $$
BEGIN
    -- Only create sample data if the users table is empty
    IF NOT EXISTS (SELECT 1 FROM users LIMIT 1) THEN
        -- This is a placeholder - actual seed data should be handled by the application
        RAISE NOTICE 'Database initialized successfully. Ready for seed data.';
    END IF;
END $$;
