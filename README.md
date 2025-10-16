# 💬 WhatsApp Clone

A full-featured WhatsApp clone application built with modern web technologies, providing real-time messaging, media sharing, and an intuitive user interface that mirrors the popular messaging platform.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## ✨ Features

### Core Functionality
- **Real-time Messaging**: Instant message delivery using WebSocket connections ✅
- **User Authentication**: Secure login and registration system ✅
- **Contact Management**: Add, block, and manage contacts ✅
- **Group Chats**: Create and manage group conversations ✅
- **Media Sharing**: Send and receive images, videos, and documents 🎨 *(UI Ready - Backend Pending)*
- **Voice Messages**: Record and send audio messages 🎨 *(UI Ready - Backend Pending)*
- **Message Status**: Delivery and read receipts ✅
- **Typing Indicators**: Real-time typing status ✅
- **Online Status**: See when contacts are online ✅
- **Last Seen**: View last active timestamp ✅
- **Profile Management**: Update profile picture and status 🎨 *(UI Ready - Backend Pending)*
- **Message Search**: Search through conversation history ✅
- **Emoji Support**: Full emoji keyboard integration 🎨 *(UI Ready - Backend Pending)*
- **Message Reactions**: React to messages with emojis 🎨 *(UI Ready - Backend Pending)*
- **Reply & Forward**: Reply to specific messages and forward content 🎨 *(UI Ready - Backend Pending)*
- **Dark Mode**: Toggle between light and dark themes 🎨 *(UI Ready - Backend Pending)*

### Additional Features
- **End-to-End Encryption** (optional): Secure message encryption ⏳ *(Planned)*
- **Push Notifications**: Real-time notifications for new messages ✅
- **Archive Chats**: Archive conversations for better organization ✅
- **Mute Conversations**: Silence notifications for specific chats ✅
- **Delete Messages**: Delete messages for yourself or everyone ✅
- **Media Gallery**: View all shared media in conversations 🎨 *(UI Ready - Backend Pending)*
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile ✅

### Legend
- ✅ **Fully Implemented**: Complete frontend and backend functionality
- 🎨 **UI Ready**: Frontend interface is complete, backend API implementation pending
- ⏳ **Planned**: Feature scheduled for future development

## 🛠 Tech Stack

### Frontend
- **React.js** - UI framework
- **Redux/Context API** - State management
- **Socket.io Client** - Real-time communication
- **Material-UI / Styled Components** - UI components and styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - WebSocket implementation
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

### Additional Tools
- **Redis** (optional) - Caching and session management
- **AWS S3 / Cloudinary** - Media storage
- **Firebase** (optional) - Push notifications
- **Nginx** - Reverse proxy and load balancing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** or **yarn**
- **MongoDB** (v4.x or higher)
- **Git**
- **Redis** (optional, for caching)

## 📊 Implementation Status

### ✅ Fully Functional Features
- User authentication (login, register, logout)
- Real-time messaging (text messages)
- Contact management (add, remove, block)
- Group chat creation and management
- Message delivery and read receipts
- Typing indicators
- Online/offline status
- Last seen timestamp
- Message search
- Archive and mute chats
- Delete messages
- Push notifications
- Responsive design

### 🎨 Frontend Complete (Backend Pending)

#### Media Sharing
- **Status**: UI icons and upload dialogs implemented
- **Pending**: Backend file upload handler, cloud storage integration (AWS S3/Cloudinary), file type validation, compression
- **Location**: `client/src/components/MessageInput.jsx` - Media buttons present

#### Voice Messages
- **Status**: Recording button and waveform UI ready
- **Pending**: Audio recording API, file compression, streaming support
- **Location**: `client/src/components/VoiceRecorder.jsx` - Interface complete

#### Profile Management
- **Status**: Profile edit modal and image upload UI complete
- **Pending**: PUT `/api/users/profile` endpoint, image processing, validation
- **Location**: `client/src/components/ProfileModal.jsx` - Full UI ready

#### Message Reactions
- **Status**: Emoji picker and reaction display UI implemented
- **Pending**: Reaction storage in database, real-time sync via Socket.io
- **Location**: `client/src/components/MessageReactions.jsx` - UI complete

#### Emoji Support
- **Status**: Emoji keyboard component integrated
- **Pending**: Emoji data persistence, search optimization
- **Location**: `client/src/components/EmojiPicker.jsx` - Picker ready

#### Reply & Forward
- **Status**: Reply/forward UI buttons and preview cards ready
- **Pending**: Message threading logic, forward API endpoint
- **Location**: `client/src/components/MessageActions.jsx` - Controls present

#### Dark Mode
- **Status**: Theme toggle switch implemented
- **Pending**: Complete theme variables for all components, localStorage persistence
- **Location**: `client/src/contexts/ThemeContext.jsx` - Toggle functional

### ⏳ Planned Features
- Video calling
- Voice calling  
- Stories/Status updates
- End-to-end encryption
- Desktop application

## 🚧 Contributing to Pending Features

If you'd like to help implement the backend for features marked as "UI Ready", please check the [Contributing](#contributing) section and look for issues tagged with `backend-needed` or `help-wanted`.

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/saqeebalam/whatsapp-clone.git
cd whatsapp-clone
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd server
npm install
```

#### Frontend Setup
```bash
cd client
npm install
```

### 3. Environment Configuration

Create `.env` files in both client and server directories.

#### Server `.env`
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/whatsapp-clone
# or for MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp-clone

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# File Storage (choose one)
# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=us-east-1

# OR Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase (optional, for push notifications)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id

# CORS
CLIENT_URL=http://localhost:3000
```

#### Client `.env`
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

## ⚙️ Configuration

### Database Setup

#### MongoDB Local Installation
```bash
# Start MongoDB service
sudo systemctl start mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

#### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Whitelist your IP address
4. Create database user
5. Get connection string and add to `.env`

### Redis Setup (Optional)
```bash
# Install Redis (Ubuntu/Debian)
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

## 🎯 Usage

### Development Mode

#### Start Backend Server
```bash
cd server
npm run dev
```
The server will run on `http://localhost:5000`

#### Start Frontend Application
```bash
cd client
npm start
```
The application will open at `http://localhost:3000`

### Production Build

#### Build Frontend
```bash
cd client
npm run build
```

#### Start Production Server
```bash
cd server
npm start
```

### Using Docker (Optional)

```bash
# Build and run with Docker Compose
docker-compose up -d

# Stop containers
docker-compose down
```

## 📁 Project Structure

```
whatsapp-clone/
├── client/                  # Frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # Redux store, actions, reducers
│   │   ├── services/       # API service calls
│   │   ├── socket/         # Socket.io client configuration
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # Global styles
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── server/                  # Backend application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── socket/             # Socket.io server logic
│   ├── utils/              # Utility functions
│   ├── validators/         # Input validation
│   ├── server.js           # Entry point
│   ├── package.json
│   └── .env
│
├── docker-compose.yml
├── .gitignore
├── LICENSE
└── README.md
```

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "John Doe",
  "status": "Hey there! I'm using WhatsApp Clone",
  "profilePicture": [file]
}
```

### Chat Endpoints

#### Get All Chats
```http
GET /api/chats
Authorization: Bearer {token}
```

#### Create or Get Chat
```http
POST /api/chats
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id_here"
}
```

#### Send Message
```http
POST /api/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "chatId": "chat_id_here",
  "content": "Hello, how are you?",
  "type": "text"
}
```

### Socket Events

#### Client Events
- `join`: Join a chat room
- `typing`: Notify typing status
- `stop-typing`: Stop typing notification
- `send-message`: Send a message
- `message-read`: Mark message as read

#### Server Events
- `message-received`: New message notification
- `typing`: User is typing
- `stop-typing`: User stopped typing
- `message-delivered`: Message delivered confirmation
- `user-online`: User came online
- `user-offline`: User went offline

## 🧪 Testing

### Run Unit Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Run E2E Tests
```bash
npm run test:e2e
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines
- Use ESLint and Prettier for code formatting
- Follow Airbnb JavaScript Style Guide
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Contact

**Saqeeb Alam**

- GitHub: [@saqeebalam](https://github.com/saqeebalam)
- LinkedIn: [Saqeeb Alam](https://www.linkedin.com/in/saqeeb-alam-483762231)
- Project Link: [https://github.com/saqeebalam/whatsapp-clone](https://github.com/saqeebalam/whatsapp-clone)

## 🙏 Acknowledgments

- Inspired by WhatsApp
- Icons from [Material Icons](https://material.io/icons/)
- Built with love and React ⚛️

## 🐛 Known Issues

- **Media Sharing**: UI components ready, backend upload and storage pending
- **Voice Messages**: Recording interface implemented, server-side processing needed
- **Profile Management**: Profile update UI complete, API endpoints in development
- **Message Reactions**: Emoji picker UI ready, database schema and sync pending
- **Reply & Forward**: UI controls present, message linking logic not yet implemented
- **Dark Mode**: Theme toggle present, some component styling incomplete
- **Media Gallery**: Gallery view implemented, media aggregation API pending
- Group call feature under development
- Offline message queue pending implementation

## 🗺️ Roadmap

### In Progress (UI Complete, Backend Pending)
- [ ] Media Sharing - File upload and storage implementation
- [ ] Voice Messages - Audio recording and streaming
- [ ] Profile Management - User profile update APIs
- [ ] Message Reactions - Reaction storage and synchronization
- [ ] Emoji Support - Emoji data handling and persistence
- [ ] Reply & Forward - Message threading and forwarding logic
- [ ] Dark Mode - Complete theme system integration

### Planned Features
- [ ] Video calling feature
- [ ] Voice calling feature
- [ ] Stories/Status feature
- [ ] Message encryption (End-to-end)
- [ ] Desktop application (Electron)
- [ ] Message backup and restore
- [ ] Multi-device support
- [ ] Sticker support
- [ ] Media compression optimization

---

**Note**: This is a clone project created for educational purposes. It is not affiliated with WhatsApp Inc.