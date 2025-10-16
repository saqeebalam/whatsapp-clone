# WhatsApp Clone - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [API Reference](#api-reference)
4. [WebSocket Events](#websocket-events)
5. [Authentication & Authorization](#authentication--authorization)
6. [File Upload & Storage](#file-upload--storage)
7. [Real-time Communication](#real-time-communication)
8. [State Management](#state-management)
9. [Security](#security)
10. [Performance Optimization](#performance-optimization)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │ ◄─────► │   Backend    │ ◄─────► │  Database   │
│  (React)    │         │  (Node.js)   │         │  (MongoDB)  │
└─────────────┘         └──────────────┘         └─────────────┘
       │                        │                        
       │                        │                        
       ▼                        ▼                        
┌─────────────┐         ┌──────────────┐                
│ Socket.io   │ ◄─────► │  Socket.io   │                
│   Client    │         │   Server     │                
└─────────────┘         └──────────────┘                
                               │
                               ▼
                        ┌──────────────┐
                        │    Redis     │
                        │   (Cache)    │
                        └──────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │   AWS S3 /   │
                        │  Cloudinary  │
                        └──────────────┘
```

### Application Flow

1. **User Authentication**: User logs in, JWT token is generated
2. **WebSocket Connection**: Client establishes Socket.io connection
3. **Chat Loading**: User's chats and contacts are fetched
4. **Real-time Updates**: Messages and status updates via WebSocket
5. **Media Handling**: Files uploaded to cloud storage, URLs stored in DB

### Technology Stack Rationale

- **React**: Component-based architecture for reusable UI
- **Node.js/Express**: Non-blocking I/O for handling concurrent connections
- **MongoDB**: Flexible schema for chat data and horizontal scaling
- **Socket.io**: Bi-directional real-time communication
- **Redis**: Fast caching for active sessions and online status
- **JWT**: Stateless authentication for scalability

---

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  phone: String (unique, indexed),
  password: String (hashed),
  profilePicture: String,
  status: String,
  lastSeen: Date,
  isOnline: Boolean,
  contacts: [ObjectId] (ref: 'User'),
  blockedUsers: [ObjectId] (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email`: Unique index for fast login queries
- `phone`: Unique index for phone-based lookup
- `name`: Text index for search functionality

### Chats Collection

```javascript
{
  _id: ObjectId,
  chatName: String,
  isGroupChat: Boolean,
  users: [ObjectId] (ref: 'User'),
  latestMessage: ObjectId (ref: 'Message'),
  groupAdmin: ObjectId (ref: 'User'),
  groupPicture: String,
  createdAt: Date,
  updatedAt: Date,
  unreadCount: Map {
    userId: Number
  }
}
```

**Indexes:**
- `users`: Multi-key index for finding user's chats
- `updatedAt`: Descending index for sorting by recent activity

### Messages Collection

```javascript
{
  _id: ObjectId,
  sender: ObjectId (ref: 'User'),
  content: String,
  chat: ObjectId (ref: 'Chat'),
  messageType: String, // 'text', 'image', 'video', 'audio', 'document'
  mediaUrl: String,
  mediaSize: Number,
  replyTo: ObjectId (ref: 'Message'),
  reactions: [{
    user: ObjectId (ref: 'User'),
    emoji: String
  }],
  readBy: [ObjectId] (ref: 'User'),
  deliveredTo: [ObjectId] (ref: 'User'),
  deletedFor: [ObjectId] (ref: 'User'),
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `chat`: Index for fetching chat messages
- `createdAt`: Descending index for message ordering
- Compound index: `(chat, createdAt)` for optimized queries

### Status/Stories Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  mediaUrl: String,
  mediaType: String, // 'image', 'video'
  caption: String,
  viewedBy: [ObjectId] (ref: 'User'),
  expiresAt: Date,
  createdAt: Date
}
```

**Indexes:**
- `user`: Index for user's statuses
- `expiresAt`: TTL index for automatic deletion

---

## API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### POST `/auth/register`
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49d7e4b83c5c5c5c5c",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "profilePicture": "default.jpg"
  }
}
```

#### POST `/auth/login`
Login user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### POST `/auth/logout`
Logout user (invalidate token)

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Users

#### GET `/users/profile`
Get current user's profile

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "60d5ec49d7e4b83c5c5c5c5c",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "profilePicture": "https://...",
    "status": "Hey there!",
    "lastSeen": "2025-10-16T10:30:00.000Z",
    "isOnline": true
  }
}
```

#### PUT `/users/profile`
Update user profile

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
name: "John Updated"
status: "New status message"
profilePicture: [File]
```

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

#### GET `/users/search?query=john`
Search users

**Query Parameters:**
- `query`: Search term (name, email, or phone)

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": "..."
    }
  ]
}
```

#### POST `/users/contacts`
Add contact

**Request Body:**
```json
{
  "userId": "60d5ec49d7e4b83c5c5c5c5c"
}
```

#### DELETE `/users/contacts/:userId`
Remove contact

#### POST `/users/block/:userId`
Block user

#### DELETE `/users/block/:userId`
Unblock user

### Chats

#### GET `/chats`
Get all chats for current user

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "chats": [
    {
      "_id": "...",
      "isGroupChat": false,
      "users": [...],
      "latestMessage": {
        "content": "Hello!",
        "sender": {...},
        "createdAt": "..."
      },
      "unreadCount": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

#### POST `/chats`
Create or get one-on-one chat

**Request Body:**
```json
{
  "userId": "60d5ec49d7e4b83c5c5c5c5c"
}
```

#### POST `/chats/group`
Create group chat

**Request Body:**
```json
{
  "name": "Team Chat",
  "users": ["userId1", "userId2", "userId3"]
}
```

#### PUT `/chats/group/:chatId`
Update group chat

**Request Body:**
```json
{
  "name": "New Group Name",
  "groupPicture": "..."
}
```

#### PUT `/chats/group/:chatId/add`
Add users to group

**Request Body:**
```json
{
  "users": ["userId1", "userId2"]
}
```

#### PUT `/chats/group/:chatId/remove`
Remove user from group

**Request Body:**
```json
{
  "userId": "60d5ec49d7e4b83c5c5c5c5c"
}
```

#### DELETE `/chats/:chatId`
Delete chat

### Messages

#### GET `/messages/:chatId`
Get messages for a chat

**Query Parameters:**
- `page`: Page number
- `limit`: Messages per page (default: 50)

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "_id": "...",
      "sender": {...},
      "content": "Hello!",
      "messageType": "text",
      "readBy": [...],
      "deliveredTo": [...],
      "createdAt": "...",
      "replyTo": {...}
    }
  ]
}
```

#### POST `/messages`
Send message

**Request Body:**
```json
{
  "chatId": "...",
  "content": "Hello, how are you?",
  "messageType": "text",
  "replyTo": "messageId" // optional
}
```

#### POST `/messages/media`
Send media message

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
```
chatId: "..."
file: [File]
messageType: "image"
caption: "Check this out!" // optional
```

#### PUT `/messages/:messageId/react`
React to message

**Request Body:**
```json
{
  "emoji": "👍"
}
```

#### DELETE `/messages/:messageId/react`
Remove reaction

#### PUT `/messages/:messageId/read`
Mark message as read

#### DELETE `/messages/:messageId`
Delete message

**Query Parameters:**
- `deleteForEveryone`: true/false

### Status/Stories

#### GET `/status`
Get status updates

**Response:**
```json
{
  "success": true,
  "statuses": [
    {
      "user": {...},
      "statuses": [
        {
          "_id": "...",
          "mediaUrl": "...",
          "mediaType": "image",
          "caption": "...",
          "viewedBy": [...],
          "createdAt": "..."
        }
      ]
    }
  ]
}
```

#### POST `/status`
Upload status

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [File]
caption: "My status update"
```

#### POST `/status/:statusId/view`
Mark status as viewed

#### DELETE `/status/:statusId`
Delete status

---

## WebSocket Events

### Connection

```javascript
// Client-side connection
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Client Events (Emit)

#### `setup`
Initialize user connection
```javascript
socket.emit('setup', userData);
```

#### `join-chat`
Join a chat room
```javascript
socket.emit('join-chat', chatId);
```

#### `leave-chat`
Leave a chat room
```javascript
socket.emit('leave-chat', chatId);
```

#### `typing`
Notify typing status
```javascript
socket.emit('typing', { chatId, userName });
```

#### `stop-typing`
Stop typing notification
```javascript
socket.emit('stop-typing', chatId);
```

#### `send-message`
Send a message
```javascript
socket.emit('send-message', messageData);
```

#### `message-delivered`
Confirm message delivery
```javascript
socket.emit('message-delivered', { messageId, userId });
```

#### `message-read`
Mark message as read
```javascript
socket.emit('message-read', { messageId, userId });
```

### Server Events (Listen)

#### `connected`
Confirmation of connection
```javascript
socket.on('connected', () => {
  console.log('Connected to socket server');
});
```

#### `message-received`
New message notification
```javascript
socket.on('message-received', (message) => {
  // Update UI with new message
});
```

#### `typing`
User is typing
```javascript
socket.on('typing', ({ chatId, userName }) => {
  // Show typing indicator
});
```

#### `stop-typing`
User stopped typing
```javascript
socket.on('stop-typing', (chatId) => {
  // Hide typing indicator
});
```

#### `user-online`
User came online
```javascript
socket.on('user-online', (userId) => {
  // Update user's online status
});
```

#### `user-offline`
User went offline
```javascript
socket.on('user-offline', ({ userId, lastSeen }) => {
  // Update user's offline status
});
```

#### `message-delivered`
Message delivered confirmation
```javascript
socket.on('message-delivered', ({ messageId, userId }) => {
  // Update message delivery status
});
```

#### `message-read`
Message read confirmation
```javascript
socket.on('message-read', ({ messageId, userId }) => {
  // Update message read status
});
```

#### `chat-updated`
Chat information updated
```javascript
socket.on('chat-updated', (chatData) => {
  // Update chat details
});
```

#### `user-added-to-group`
User added to group chat
```javascript
socket.on('user-added-to-group', ({ chatId, user }) => {
  // Update group members
});
```

#### `user-removed-from-group`
User removed from group
```javascript
socket.on('user-removed-from-group', ({ chatId, userId }) => {
  // Update group members
});
```

---

## Authentication & Authorization

### JWT Token Structure

```javascript
{
  payload: {
    id: "userId",
    email: "user@example.com",
    iat: 1634567890, // issued at
    exp: 1635172690  // expiration
  }
}
```

### Token Generation

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
```

### Authentication Middleware

```javascript
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
  }
};
```

### Socket Authentication

```javascript
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});
```

---

## File Upload & Storage

### Multer Configuration

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif