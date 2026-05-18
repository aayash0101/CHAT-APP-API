# 💬 ChatApp

A full-stack real-time chat application built with Node.js, React, and Socket.io. Features instant messaging, direct messages, file sharing, and more — all wrapped in a polished dark UI.

![ChatApp](https://img.shields.io/badge/Status-Live-brightgreen) ![Node](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white) ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)

---

## 🚀 Live Demo

- **Frontend** → [chat-app-client-one-gold.vercel.app](https://chat-app-client-one-gold.vercel.app)
- **Backend** → [chat-app-api-y5fo.onrender.com](https://chat-app-api-y5fo.onrender.com)

---

## ✨ Features

- 🔐 **Authentication** — Register and login with JWT-based auth
- 💬 **Real-time messaging** — Instant messages powered by Socket.io
- 🏠 **Chat rooms** — Create, join, and leave multiple rooms
- 📨 **Direct messages** — Private one-on-one conversations
- 👤 **User profiles** — Avatar upload, display name, and bio
- 🔍 **Search** — Search across rooms and messages
- 📁 **File sharing** — Share images and files in chat
- ✅ **Read receipts** — Single and double tick indicators
- 🔔 **Browser notifications** — Get notified of new messages
- ⌨️ **Typing indicators** — See when others are typing
- 🟢 **Online status** — Real-time online/offline indicators

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and schemas |
| Socket.io | Real-time WebSocket communication |
| JWT + bcryptjs | Authentication and password hashing |
| Cloudinary | File and avatar storage |
| Multer | File upload handling |

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI framework and build tool |
| Tailwind CSS | Styling |
| Socket.io-client | Real-time communication |
| Axios | HTTP requests |
| React Router | Client-side routing |

---

## 📁 Project Structure

```
CHAT-APP/
├── CHAT-APP-API/                 # Backend
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── multer.js             # File upload config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   ├── userController.js
│   │   ├── dmController.js
│   │   ├── messageController.js
│   │   ├── searchController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── userRoutes.js
│   │   ├── dmRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── searchRoutes.js
│   │   └── uploadRoutes.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── .env
│   └── server.js
│
└── CHAT-APP-CLIENT/              # Frontend
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── ChatWindow.jsx
    │   │   ├── CreateRoomModal.jsx
    │   │   ├── DMSidebar.jsx
    │   │   ├── EditProfileModal.jsx
    │   │   ├── FilePreview.jsx
    │   │   ├── ImageModal.jsx
    │   │   ├── JoinRoom.jsx
    │   │   ├── MessageBubble.jsx
    │   │   ├── MessageInput.jsx
    │   │   ├── NewDMModal.jsx
    │   │   ├── ProfileModal.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── SearchBar.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── SocketContext.jsx
    │   ├── hooks/
    │   │   └── useNotifications.js
    │   ├── pages/
    │   │   ├── ChatPage.jsx
    │   │   ├── DMPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── vite.config.js
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally
- Cloudinary account

### Backend

```bash
cd CHAT-APP-API
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

### Frontend

```bash
cd CHAT-APP-CLIENT
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 🌐 Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| File Storage | Cloudinary |

### Environment variables required on Render

```
PORT=5000
MONGO_URI=your_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Environment variables required on Vercel

```
VITE_API_URL=https://your-render-url.onrender.com/api
VITE_BACKEND_URL=https://your-render-url.onrender.com
```

---

## 📡 API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user |

### Rooms
| Method | Route | Description |
|---|---|---|
| GET | `/api/rooms` | Get all rooms |
| POST | `/api/rooms` | Create a room |
| GET | `/api/rooms/:id/messages` | Get room messages |
| POST | `/api/rooms/:id/join` | Join a room |
| DELETE | `/api/rooms/:id/leave` | Leave a room |

### Direct Messages
| Method | Route | Description |
|---|---|---|
| GET | `/api/dms` | Get all DMs |
| POST | `/api/dms` | Start or open a DM |
| GET | `/api/dms/:id/messages` | Get DM messages |

### Users
| Method | Route | Description |
|---|---|---|
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/avatar` | Upload avatar |
| GET | `/api/users/search?q=` | Search users |

### Other
| Method | Route | Description |
|---|---|---|
| GET | `/api/search?q=` | Search rooms and messages |
| POST | `/api/upload` | Upload a file |
| POST | `/api/messages/:roomId/read` | Mark messages as read |

---

## 🔌 Socket Events

### Client → Server
| Event | Payload | Description |
|---|---|---|
| `room:join` | `roomId` | Join a room |
| `room:leave` | `roomId` | Leave a room |
| `message:send` | `{ roomId, content, fileUrl, ... }` | Send a message |
| `typing:start` | `{ roomId }` | Start typing |
| `typing:stop` | `{ roomId }` | Stop typing |
| `messages:read` | `{ roomId }` | Mark messages as read |

### Server → Client
| Event | Payload | Description |
|---|---|---|
| `message:receive` | Message object | New message |
| `user:online` | `{ userId, username }` | User came online |
| `user:offline` | `{ userId, username }` | User went offline |
| `typing:update` | `{ username, isTyping }` | Typing status |
| `messages:read` | `{ roomId, userId }` | Messages read |

---

## 👨‍💻 Author

Built from scratch as a learning project — from zero to a fully deployed real-time chat app.

---

## 📄 License

MIT