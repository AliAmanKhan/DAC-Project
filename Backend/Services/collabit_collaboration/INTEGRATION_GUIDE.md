# Integration Guide - Completing the Collaboration Feature

## Step 1: Implement Pitch Service Integration

Update the `getPitchOwnerId()` method in `CollaborationServiceImpl.java`:

```java
private Long getPitchOwnerId(Long pitchId) {
    try {
        String pitchServiceUrl = "http://localhost:8081/pitches/" + pitchId;
        PitchResponse response = restTemplate.getForObject(pitchServiceUrl, PitchResponse.class);
        if (response != null) {
            return response.getOwnerId();
        }
    } catch (Exception e) {
        // Log the error
        e.printStackTrace();
    }
    return null;
}
```

**Assumptions:**
- Pitch Service runs on `localhost:8081`
- Endpoint: `GET /pitches/{pitchId}` returns a PitchResponse with `ownerId`
- Adjust URL and endpoint based on your actual Pitch Service setup

---

## Step 2: Implement User Service Integration

Update the `mapNotificationToDto()` method in `CollaborationServiceImpl.java`:

```java
private CollaborationNotificationDto mapNotificationToDto(CollaborationNotification notification) {
    CollaborationNotificationDto dto = new CollaborationNotificationDto();
    CollaborationRequest request = notification.getCollaborationRequest();

    dto.setNotificationId(notification.getId());
    dto.setPitchId(request.getPitchId());
    dto.setRequesterUserId(request.getRequesterUserId());
    dto.setMessage(request.getMessage());
    dto.setStatus(notification.getStatus());
    dto.setCreatedAt(notification.getCreatedAt());
    dto.setReadAt(notification.getReadAt());

    // Fetch requester details from User Service
    try {
        String userServiceUrl = "http://localhost:8083/users/" + request.getRequesterUserId();
        UserResponse userResponse = restTemplate.getForObject(userServiceUrl, UserResponse.class);
        if (userResponse != null) {
            dto.setRequesterUsername(userResponse.getUsername());
            dto.setRequesterEmail(userResponse.getEmail());
        }
    } catch (Exception e) {
        // Set default values if service is unavailable
        dto.setRequesterUsername("user_" + request.getRequesterUserId());
        dto.setRequesterEmail("user_" + request.getRequesterUserId() + "@example.com");
    }

    return dto;
}
```

**Assumptions:**
- User Service runs on `localhost:8083`
- Endpoint: `GET /users/{userId}` returns a UserResponse with `username` and `email`
- Adjust URL and endpoint based on your actual User Service setup

---

## Step 3: Verify API Gateway Routes

Ensure your API Gateway routes collaboration requests:

**In API-Gateway/src/config/services.js or similar:**

```javascript
const services = {
    // ... other services
    collaborationService: {
        url: 'http://localhost:8082'
    },
    // ... other services
};
```

**In API-Gateway routes:**

```javascript
// Proxy collaboration endpoints
app.use('/collaborations', proxy('http://localhost:8082/collaborations'));
```

---

## Step 4: Test the Integration

### Test Flow:

1. **Create a collaboration request:**
   ```bash
   curl -X POST http://localhost:8080/collaborations/request \
     -H "X-USER-ID: 3" \
     -H "Content-Type: application/json" \
     -d '{
       "pitchId": 5,
       "message": "I would like to collaborate on this pitch"
     }'
   ```

2. **Get notifications for pitch owner:**
   ```bash
   curl http://localhost:8080/collaborations/notifications/2
   ```

3. **Check if notification was created with user details:**
   - Should show `requesterUsername` and `requesterEmail` if integration successful

4. **Accept the request:**
   ```bash
   curl -X PUT http://localhost:8080/collaborations/request/1 \
     -H "X-USER-ID: 2" \
     -H "Content-Type: application/json" \
     -d '{
       "accept": true
     }'
   ```

5. **Verify notification is read:**
   ```bash
   curl http://localhost:8080/collaborations/notifications/2/unread
   ```
   Should return empty array.

---

## Step 5: Handle Service Unavailability

The current implementation gracefully handles service unavailability:

- If Pitch Service is down → No pitch owner ID, notification not created
- If User Service is down → Default username/email used

**For Production, consider:**

1. **Retry Logic:**
   ```java
   @Retry(maxAttempts = 3, delay = 1000)
   private Long getPitchOwnerId(Long pitchId) {
       // ... implementation
   }
   ```

2. **Circuit Breaker:**
   ```java
   @CircuitBreaker(failureThreshold = 5, delay = 5000)
   private UserResponse getUserDetails(Long userId) {
       // ... implementation
   }
   ```

3. **Timeout Configuration:**
   ```java
   RestTemplate restTemplate() {
       ClientHttpRequestFactory factory = new BufferingClientHttpRequestFactory(
           new SimpleClientHttpRequestFactory());
       RestTemplate template = new RestTemplate(factory);
       return template;
   }
   ```

---

## Step 6: Optional Enhancements

### 6A: Add Pagination to Notifications

```java
@GetMapping("/notifications/{userId}")
public ResponseEntity<Page<CollaborationNotificationDto>> getNotifications(
        @PathVariable Long userId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    return ResponseEntity.ok(service.getNotificationsPaginated(userId, pageable));
}
```

### 6B: Add Email Notifications

```java
private void sendEmailNotification(Long pitchOwnerId, CollaborationRequest request) {
    try {
        String subject = "New Collaboration Request";
        String body = "User " + request.getRequesterUserId() + 
                     " wants to collaborate on your pitch";
        emailService.send(pitchOwnerId, subject, body);
    } catch (Exception e) {
        // Log but don't fail the request
    }
}
```

### 6C: Add WebSocket for Real-time Notifications

```java
@Component
public class NotificationWebSocketHandler extends TextWebSocketHandler {
    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) {
        // Handle real-time notifications
    }
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Notifications not created | Check if `getPitchOwnerId()` returns null |
| User details not showing | Check if User Service endpoint is correct |
| CORS errors | Verify CORS config is applied |
| 404 on endpoints | Check API Gateway routes |
| Notifications not marked read | Verify notification ID in request |

---

## Files to Reference

1. **Main Implementation:**
   - [CollaborationServiceImpl.java](src/main/java/com/collaboration/service/CollaborationServiceImpl.java)
   - [CollaborationController.java](src/main/java/com/collaboration/controller/CollaborationController.java)

2. **DTOs:**
   - [CollaborationNotificationDto.java](src/main/java/com/collaboration/dto/CollaborationNotificationDto.java)
   - [PitchResponse.java](src/main/java/com/collaboration/dto/PitchResponse.java)
   - [UserResponse.java](src/main/java/com/collaboration/dto/UserResponse.java)

3. **Documentation:**
   - [COLLABORATION_FEATURE.md](COLLABORATION_FEATURE.md) - Complete API documentation
   - [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Overview and status
