package com.collaboration.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collaboration.entity.CollaborationNotification;
import com.collaboration.enums.NotificationStatus;

@Repository
public interface CollaborationNotificationRepository extends JpaRepository<CollaborationNotification, Long> {

    List<CollaborationNotification> findByPitchOwnerId(Long pitchOwnerId);

    List<CollaborationNotification> findByPitchOwnerIdAndStatus(Long pitchOwnerId, NotificationStatus status);

    List<CollaborationNotification> findByCollaborationRequestId(Long requestId);

    void deleteByCollaborationRequestId(Long requestId);
}
