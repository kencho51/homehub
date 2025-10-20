# API Reference

Complete API documentation for Family Hub endpoints.

## Base URL

All API requests are made to: `/api`

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Obtaining a Token

Use the login or register endpoints to obtain a token.

## Response Format

All responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "data": { ... }
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

**Validation Rules:**
- `name`: 2-100 characters
- `email`: Valid email format
- `password`: 6-100 characters

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Calendar Events

#### List All Events
```http
GET /api/calendar
GET /api/calendar?startDate=2024-01-01T00:00:00.000Z&endDate=2024-12-31T23:59:59.999Z
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): ISO 8601 datetime
- `endDate` (optional): ISO 8601 datetime

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "id": "uuid",
      "title": "Family Dinner",
      "description": "Weekly family dinner",
      "startDate": "2024-01-15T18:00:00.000Z",
      "endDate": "2024-01-15T20:00:00.000Z",
      "location": "Home",
      "allDay": false,
      "createdBy": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "creator": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

#### Create Event
```http
POST /api/calendar
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Family Dinner",
  "description": "Weekly family dinner",
  "startDate": "2024-01-15T18:00:00.000Z",
  "endDate": "2024-01-15T20:00:00.000Z",
  "location": "Home",
  "allDay": false
}
```

**Validation Rules:**
- `title`: Required, max 200 characters
- `description`: Optional, max 2000 characters
- `startDate`: Required, ISO 8601 datetime
- `endDate`: Required, ISO 8601 datetime
- `location`: Optional, max 200 characters
- `allDay`: Boolean, default false

**Response:**
```json
{
  "success": true,
  "event": { ... }
}
```

#### Get Event by ID
```http
GET /api/calendar/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "event": { ... }
}
```

#### Update Event
```http
PUT /api/calendar/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "startDate": "2024-01-15T18:00:00.000Z",
  "endDate": "2024-01-15T20:00:00.000Z",
  "location": "New Location",
  "allDay": true
}
```

**Authorization:** User must be creator or admin

**Response:**
```json
{
  "success": true,
  "event": { ... }
}
```

#### Delete Event
```http
DELETE /api/calendar/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Authorization:** User must be creator or admin

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

### Travel Plans

#### List All Travel Plans
```http
GET /api/travel
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "travelPlans": [
    {
      "id": "uuid",
      "title": "Summer Vacation",
      "destination": "Beach Resort",
      "description": "Annual family vacation",
      "startDate": "2024-07-01T00:00:00.000Z",
      "endDate": "2024-07-08T00:00:00.000Z",
      "itinerary": "[{\"day\":1,\"activity\":\"Arrival\"}]",
      "budget": 5000,
      "createdBy": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "creator": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

#### Create Travel Plan
```http
POST /api/travel
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Summer Vacation",
  "destination": "Beach Resort",
  "description": "Annual family vacation",
  "startDate": "2024-07-01T00:00:00.000Z",
  "endDate": "2024-07-08T00:00:00.000Z",
  "itinerary": "[{\"day\":1,\"activity\":\"Arrival\"}]",
  "budget": 5000
}
```

**Validation Rules:**
- `title`: Required, max 200 characters
- `destination`: Required, max 200 characters
- `description`: Optional, max 2000 characters
- `startDate`: Required, ISO 8601 datetime
- `endDate`: Required, ISO 8601 datetime
- `itinerary`: Optional, JSON string, max 10000 characters
- `budget`: Optional, positive number

**Response:**
```json
{
  "success": true,
  "travelPlan": { ... }
}
```

#### Get Travel Plan by ID
```http
GET /api/travel/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "travelPlan": { ... }
}
```

#### Update Travel Plan
```http
PUT /api/travel/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "destination": "New Destination",
  "description": "Updated description",
  "startDate": "2024-07-01T00:00:00.000Z",
  "endDate": "2024-07-08T00:00:00.000Z",
  "itinerary": "[{\"day\":1,\"activity\":\"Beach\"}]",
  "budget": 6000
}
```

**Authorization:** User must be creator or admin

**Response:**
```json
{
  "success": true,
  "travelPlan": { ... }
}
```

#### Delete Travel Plan
```http
DELETE /api/travel/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Authorization:** User must be creator or admin

**Response:**
```json
{
  "success": true,
  "message": "Travel plan deleted successfully"
}
```

---

### News Entries

#### List All News
```http
GET /api/news
GET /api/news?limit=20
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of entries to return (default: 50)

**Response:**
```json
{
  "success": true,
  "newsEntries": [
    {
      "id": "uuid",
      "title": "Welcome to Family Hub!",
      "content": "We are excited to launch...",
      "createdBy": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "creator": {
        "id": "uuid",
        "name": "Admin User",
        "email": "admin@family-hub.com"
      }
    }
  ]
}
```

#### Create News Entry
```http
POST /api/news
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Important Announcement",
  "content": "This is an important family update..."
}
```

**Validation Rules:**
- `title`: Required, max 200 characters
- `content`: Required, 1-10000 characters

**Response:**
```json
{
  "success": true,
  "newsEntry": { ... }
}
```

#### Get News Entry by ID
```http
GET /api/news/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "newsEntry": { ... }
}
```

#### Update News Entry
```http
PUT /api/news/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Authorization:** User must be creator or admin

**Response:**
```json
{
  "success": true,
  "newsEntry": { ... }
}
```

#### Delete News Entry
```http
DELETE /api/news/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Authorization:** User must be creator or admin

**Response:**
```json
{
  "success": true,
  "message": "News entry deleted successfully"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Validation error or invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production:
- Login: 5 attempts per 15 minutes
- Registration: 3 attempts per hour
- API calls: 100 requests per minute per user

## Best Practices

1. **Always include Authorization header** for protected endpoints
2. **Use ISO 8601 format** for all datetime values
3. **Handle errors gracefully** on the client side
4. **Store tokens securely** (httpOnly cookies recommended)
5. **Refresh tokens** before they expire
6. **Validate input** on both client and server

## Example Usage

### JavaScript/TypeScript
```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
  }),
})
const data = await response.json()
const token = data.token

// Create calendar event
const event = await fetch('/api/calendar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: 'Family Dinner',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  }),
})
```

### cURL
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@family-hub.com","password":"admin123"}'

# Create event (replace TOKEN with actual token)
curl -X POST http://localhost:3000/api/calendar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title":"Family Dinner",
    "startDate":"2024-01-15T18:00:00.000Z",
    "endDate":"2024-01-15T20:00:00.000Z"
  }'
```

## Support

For API questions or issues, please open an issue on the GitHub repository.

