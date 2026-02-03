-- Migration: Create collaboration_notifications table

CREATE TABLE IF NOT EXISTS collaboration_notifications (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    pitch_owner_id BIGINT NOT NULL,
    collaboration_request_id BIGINT NOT NULL,
    status ENUM('UNREAD', 'READ') NOT NULL DEFAULT 'UNREAD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (collaboration_request_id) REFERENCES collaboration_requests(id) ON DELETE CASCADE,
    INDEX idx_pitch_owner_id (pitch_owner_id),
    INDEX idx_status (status)
);
