-- Module admin : index de performance et monitoring

CREATE INDEX IF NOT EXISTS idx_monitoring_events_type ON monitoring_events (event_type);
CREATE INDEX IF NOT EXISTS idx_monitoring_events_created_at ON monitoring_events (created_at);
