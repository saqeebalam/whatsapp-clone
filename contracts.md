# WhatsApp Clone - Backend Contracts

## Mock Data to Replace

### mockData.js - Currently Mocked:
1. **mockContacts**: List of contacts with avatars, last messages, online status
2. **mockMessages**: Conversation history for each contact

## API Contracts

### 1. Authentication
- **POST /api/auth/register** - Register new user
  - Body: `{ username, password, displayName }`
  - Response: `{ userId, token }`

- **POST /api/auth/login** - Login user
  - Body: `{ username, password }`
  - Response: `{ userId, token, displayName }`

### 2. Contacts/Users
- **GET /api/users** - Get all users (contacts list)
  - Headers: `Authorization: Bearer {token}`
  - Response: `[{ userId, displayName, avatar, online }]`

- **GET /api/users/:userId** - Get user details
  - Response: `{ userId, displayName, avatar, online, lastSeen }`

### 3. Conversations
- **GET /api/conversations** - Get all conversations for logged-in user
  - Response: `[{ conversationId, otherUser, lastMessage, timestamp, unreadCount }]`

- **GET /api/conversations/:conversationId/messages** - Get messages in a conversation
  - Response: `[{ messageId, text, senderId, timestamp, status }]`

- **POST /api/conversations/:conversationId/messages** - Send message
  - Body: `{ text }`
  - Response: `{ messageId, text, senderId, timestamp, status }`

- **PUT /api/conversations/:conversationId/read** - Mark messages as read
  - Response: `{ success: true }`

### 4. Real-time Updates
- **GET /api/messages/poll** - Poll for new messages (long polling)
  - Query: `?lastMessageId=123`
  - Response: `[{ messageId, conversationId, text, senderId, timestamp }]`

## Database Models

### User
```
{
  _id: ObjectId,
  username: string (unique),
  password: string (hashed),
  displayName: string,
  avatar: string (URL),
  online: boolean,
  lastSeen: datetime,
  createdAt: datetime
}
```

### Message
```
{
  _id: ObjectId,
  conversationId: string,
  senderId: ObjectId,
  receiverId: ObjectId,
  text: string,
  status: string (sent/delivered/read),
  createdAt: datetime
}
```

### Conversation
```
{
  _id: ObjectId,
  participants: [ObjectId, ObjectId],
  lastMessage: string,
  lastMessageTime: datetime,
  createdAt: datetime
}
```

## Frontend Integration Plan

1. Create `AuthContext` for user authentication state
2. Add login/register screens
3. Replace mock data with API calls in `ChatList` and `ChatWindow`
4. Add polling mechanism for real-time message updates
5. Store JWT token in localStorage
6. Add axios interceptor for auth headers
