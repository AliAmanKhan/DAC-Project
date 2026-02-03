# Collaboration Feature Implementation Guide

## Overview
This document outlines the complete collaboration workflow for the Collabit platform, where users can request to collaborate on pitches owned by other users, with a notification system for pitch owners to accept or reject requests.

## Architecture

### Components
1. **CollaborationRequest Entity** - Stores collaboration requests from users
2. **CollaborationNotification Entity** - Stores notifications for pitch owners
3. **ProjectMember Entity** - Stores confirmed members of a pitch
4. **Collaboration Service** - Business logic for handling requests and notifications

### Database Tables

#### collaboration_requests
```sql
- id (BIGINT, Primary Key, Auto Increment)
- pitchId (BIGINT)
- requesterUserId (BIGINT)
- status (ENUM: REQUESTED, ACCEPTED, REJECTED, WITHDRAWN)
- message (TEXT)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### collaboration_notifications
```sql
- id (BIGINT, Primary Key, Auto Increment)
- pitchOwnerId (BIGINT)
- collaborationRequestId (BIGINT, Foreign Key)
- status (ENUM: UNREAD, READ)
- createdAt (TIMESTAMP)
- readAt (TIMESTAMP)
```

#### project_members
```sql
- id (BIGINT, Primary Key, Auto Increment)
- pitchId (BIGINT)
- userId (BIGINT)
- role (ENUM: ADMIN, MEMBER)
- joinedAt (TIMESTAMP)
```

## API Endpoints

### 1. Request to Join a Pitch
**POST** `/collaborations/request`

Request Header:
```
X-USER-ID: <userId>
```

Request Body:
```json
{
  "pitchId": 1,
  "message": "I'm interested in collaborating on this project"
}
```

Response:
```
HTTP 200 OK
```

**Behavior:**
- User requests to join a pitch
- Validation checks if request already exists
- Creates a CollaborationRequest with status REQUESTED
- Automatically creates a CollaborationNotification for the pitch owner with status UNREAD

---

### 2. Get Notifications for Pitch Owner
**GET** `/collaborations/notifications/{userId}`

Response:
```json
[
  {
    "notificationId": 1,
    "pitchId": 5,
    "requesterUserId": 3,
    "requesterUsername": "john_doe",
    "requesterEmail": "john@example.com",
    "message": "I want to collaborate",
    "status": "UNREAD",
    "createdAt": "2026-02-03T10:30:00",
    "readAt": null
  }
]
```

---

### 3. Get Unread Notifications Only
**GET** `/collaborations/notifications/{userId}/unread`

Response: Same as above, but only UNREAD notifications

---

### 4. Accept or Reject Collaboration Request
**PUT** `/collaborations/request/{requestId}`

Request Header:
```
X-USER-ID: <pitchOwnerId>
```

Request Body:
```json
{
  "accept": true
}
```

Response:
```
HTTP 200 OK
```

**Behavior:**
- Updates CollaborationRequest status to ACCEPTED or REJECTED
- If accepted, adds requester to project_members table as a MEMBER
- Automatically marks associated notification as READ
- Sets readAt timestamp

---

### 5. Mark Notification as Read
**PUT** `/collaborations/notifications/{notificationId}/read`

Request Header:
```
X-USER-ID: <pitchOwnerId>
```

Response:
```
HTTP 200 OK
```

**Behavior:**
- Updates notification status to READ
- Sets readAt timestamp
- Validates that the user is the pitch owner

---

### 6. Withdraw Collaboration Request
**PUT** `/collaborations/request/{requestId}/withdraw`

Request Header:
```
X-USER-ID: <requesterUserId>
```

Response:
```
HTTP 200 OK
```

**Behavior:**
- Allows requester to cancel their pending request
- Updates status to WITHDRAWN
- Deletes associated notifications

---

### 7. Get All Requests for a Pitch
**GET** `/collaborations/pitch/{pitchId}/requests`

Response:
```json
[
  {
    "id": 1,
    "pitchId": 5,
    "requesterUserId": 3,
    "status": "REQUESTED",
    "message": "I want to collaborate",
    "createdAt": "2026-02-03T10:30:00",
    "updatedAt": null
  }
]
```

---

### 8. Get Project Members
**GET** `/collaborations/pitch/{pitchId}/members`

Response:
```json
[
  {
    "userId": 1,
    "role": "ADMIN",
    "joinedAt": "2026-02-03T09:00:00"
  },
  {
    "userId": 3,
    "role": "MEMBER",
    "joinedAt": "2026-02-03T10:35:00"
  }
]
```

---

## Workflow Diagram

```
User A (Requester)          Pitch Owner (User B)        System
    |                              |                        |
    |--- Request to Join --------> |                        |
    |                              |                        |
    |                              | <-- Create Notif ------|
    |                              |                        |
    |                              | Get Notifications      |
    |                              | (Shows UNREAD status)  |
    |                              |                        |
    |                              | --- Accept/Reject ---> |
    |                              |                        |
    |                              | <-- Add to Members --- |
    |                              | <-- Mark Notif READ -- |
    |                              |                        |
    |<-- Confirmation -------------|                        |
```

---

## Integration Points

### 1. Pitch Service Integration
**Issue:** The collaboration service needs to know the pitch owner ID when a collaboration request is made.

**Solution Options:**
a) **Option A (Current):** Pass pitchOwnerId in the request DTO
```json
{
  "pitchId": 1,
  "pitchOwnerId": 2,
  "message": "I want to collaborate"
}
```

b) **Option B (Recommended):** Call Pitch Service via REST to fetch pitch details
```java
private Long getPitchOwnerId(Long pitchId) {
    String pitchServiceUrl = "http://localhost:8081/pitches/" + pitchId;
    PitchResponse response = restTemplate.getForObject(pitchServiceUrl, PitchResponse.class);
    return response.getOwnerId();
}
```

c) **Option C:** Use Service Discovery (Eureka) for dynamic URLs

**Current Status:** Option B is partially implemented with a placeholder that returns null.

### 2. User Service Integration
**Issue:** The notification DTO needs user details (username, email) of the requester.

**Solution:**
```java
private UserDetailsResponse getUserDetails(Long userId) {
    String userServiceUrl = "http://localhost:8083/users/" + userId;
    return restTemplate.getForObject(userServiceUrl, UserDetailsResponse.class);
}
```

**Current Status:** Placeholder returns default values. Implement actual REST call.

---

## Next Steps

1. **Implement Pitch Service Integration**
   - Update `getPitchOwnerId()` method to call actual pitch service
   - Handle service unavailability gracefully

2. **Implement User Service Integration**
   - Update `mapNotificationToDto()` to fetch user details
   - Cache user details to reduce API calls

3. **Add Pagination**
   - Paginate notifications for better performance
   - Add filtering by status

4. **Add Email Notifications** (Optional)
   - Send email when new collaboration request arrives
   - Send email when request is accepted/rejected

5. **Frontend Integration**
   - Create UI to show notifications
   - Add polling or WebSocket for real-time updates
   - Create collaboration request form

6. **Testing**
   - Unit tests for service methods
   - Integration tests for API endpoints
   - E2E tests for complete workflow

---

## Status Transitions

```
REQUESTED (pending) -----> ACCEPTED (approved)
                  |
                  +------> REJECTED (denied)
                  |
                  +------> WITHDRAWN (user cancelled)

UNREAD (notification) -----> READ (viewed)
```

---

## Error Handling

| Scenario | Error | HTTP Status |
|----------|-------|-------------|
| Request already exists | "Collaboration request already exists" | 400 |
| Request not found | "Request not found" | 404 |
| Already processed | "Request already processed" | 400 |
| Unauthorized withdraw | "You are not allowed to withdraw this request" | 403 |
| Unauthorized read notification | "You are not authorized to read this notification" | 403 |

---

## Future Enhancements

1. **Collaboration Roles:** LEAD, MEMBER, CONTRIBUTOR with different permissions
2. **Skill-based Matching:** Recommend collaborators based on skills
3. **Collaboration Chat:** Real-time messaging for team members
4. **Activity Timeline:** Track all collaboration activities
5. **Analytics:** Measure collaboration metrics and success rates
