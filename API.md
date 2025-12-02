# CollabTask API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API supports basic task management without authentication. Future versions will include JWT-based authentication.

## Endpoints

### Tasks

#### GET /tasks
Retrieve all tasks.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Task Title",
    "description": "Task Description",
    "status": "pending",
    "assignedTo": "user@example.com",
    "priority": "high",
    "dueDate": "2024-12-31",
    "collaborators": ["user2@example.com"],
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  }
]
```

#### GET /tasks/:id
Retrieve a specific task by ID.

**Parameters:**
- `id` (string) - Task ID

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Task Title",
  "description": "Task Description",
  "status": "pending",
  "assignedTo": "user@example.com",
  "priority": "high",
  "dueDate": "2024-12-31",
  "collaborators": ["user2@example.com"],
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

#### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task Description",
  "status": "pending",
  "assignedTo": "user@example.com",
  "priority": "high",
  "dueDate": "2024-12-31",
  "collaborators": []
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "New Task",
  "description": "Task Description",
  "status": "pending",
  "assignedTo": "user@example.com",
  "priority": "high",
  "dueDate": "2024-12-31",
  "collaborators": [],
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

#### PUT /tasks/:id
Update an existing task.

**Parameters:**
- `id` (string) - Task ID

**Request Body:**
```json
{
  "title": "Updated Task",
  "status": "in-progress"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Updated Task",
  "description": "Task Description",
  "status": "in-progress",
  "assignedTo": "user@example.com",
  "priority": "high",
  "dueDate": "2024-12-31",
  "collaborators": [],
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T11:00:00Z"
}
```

#### DELETE /tasks/:id
Delete a task.

**Parameters:**
- `id` (string) - Task ID

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## WebSocket Events

### Connection
```javascript
socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Task Events

#### task:create
```javascript
socket.emit('task:create', taskData);
socket.on('task:created', (task) => {
  console.log('Task created:', task);
});
```

#### task:update
```javascript
socket.emit('task:update', { id: taskId, data: updatedData });
socket.on('task:updated', (task) => {
  console.log('Task updated:', task);
});
```

#### task:delete
```javascript
socket.emit('task:delete', taskId);
socket.on('task:deleted', (taskId) => {
  console.log('Task deleted:', taskId);
});
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK` - Successful request
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

API requests are rate-limited to 100 requests per 15 minutes per IP address.
