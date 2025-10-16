# Experiment 17b: Real-Time Chat Application with Socket.io

## Overview
This experiment demonstrates a real-time chat application built with React frontend and Express.js backend using Socket.io for WebSocket communication. The application provides instant messaging capabilities, online user tracking, typing indicators, and connection status monitoring, showcasing modern real-time web development techniques.

## Learning Objectives
- Understanding WebSocket communication with Socket.io
- Implementing real-time bidirectional communication between client and server
- Managing user sessions and online presence tracking
- Handling connection states and reconnection strategies
- Building interactive UI components with React hooks
- Implementing typing indicators and live user lists
- Setting up CORS for Socket.io cross-origin connections
- Managing client-side state for real-time applications

## Project Structure
```
Experiment-17b/
├── backend/
│   ├── server.js          # Express server with Socket.io integration
│   ├── package.json       # Backend dependencies
│   └── node_modules/      # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatRoom.tsx       # Main chat interface
│   │   │   ├── ChatRoom.css       # Chat styling
│   │   │   └── UsernameInput.tsx  # Username entry form
│   │   ├── services/
│   │   │   └── socket.ts          # Socket.io client service
│   │   ├── types.ts       # TypeScript type definitions
│   │   ├── App.tsx        # Main React application
│   │   ├── App.css        # Application styles
│   │   └── index.tsx      # React entry point
│   ├── package.json       # Frontend dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   └── node_modules/      # Frontend dependencies
└── README.md             # Project documentation
```

## Technologies Used
- **Backend**:
  - Node.js: JavaScript runtime environment
  - Express.js: Web application framework
  - Socket.io: Real-time bidirectional event-based communication
  - CORS: Cross-Origin Resource Sharing middleware
- **Frontend**:
  - React: UI library with hooks (useState, useEffect, useRef)
  - TypeScript: Static type checking
  - Socket.io Client: WebSocket client library
  - React Scripts: Build tools and development server
- **Development Tools**:
  - npm: Package manager
  - ESLint: Code linting
  - Create React App: React development environment

## Prerequisites
- Node.js (v16 or higher)
- npm package manager
- Modern web browser with WebSocket support

## Installation & Setup

1. **Navigate to the project directory**
   ```bash
   cd "Experiment-17b"
   ```

2. **Install Backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

### Method 1: Run Both Services Manually
1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server will start on `http://localhost:3002`

2. **Start the Frontend Development Server** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```
   Frontend will start on `http://localhost:3000`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

### Method 2: Alternative Commands
```bash
# Backend alternatives
cd backend
npm run dev        # Using nodemon for auto-restart

# Frontend alternatives
cd frontend
npm run build      # Build for production
npm test           # Run tests
```

## Features

### 1. Real-Time Messaging
- Instant message delivery using WebSocket connections
- Message history display with timestamps
- User identification for each message
- Support for multiple simultaneous users

### 2. Online User Tracking
- Live user list showing currently connected users
- Join/leave notifications
- User count display
- Current user identification

### 3. Typing Indicators
- Real-time typing status display
- Automatic timeout for inactive typing
- Multiple user typing support
- Non-intrusive indicator positioning

### 4. Connection Management
- Visual connection status indicator
- Automatic reconnection attempts
- Connection error handling
- Graceful disconnection on page leave

### 5. User Experience
- Username input validation
- Message length limiting
- Responsive design for different screen sizes
- Smooth scrolling to new messages
- Clean, modern UI design

## Socket.io Events

### Client to Server Events
- `user_join`: User joins the chat with username
- `send_message`: Send a new message
- `typing`: Send typing indicator status
- `disconnect`: User leaves the chat

### Server to Client Events
- `connect`: Successful connection established
- `disconnect`: Connection lost
- `connect_error`: Connection failed
- `receive_message`: New message received
- `user_joined`: Another user joined
- `user_left`: Another user left
- `users_list`: Updated list of online users
- `user_typing`: Typing indicator from another user

## Code Explanation

### Backend Implementation (`backend/server.js`)
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store connected users
const users = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Handle user joining, messaging, typing, disconnection
  // ... event handlers
});
```
- Creates HTTP server with Socket.io integration
- Manages user sessions with Map data structure
- Handles real-time events and broadcasts

### Frontend Socket Service (`frontend/src/services/socket.ts`)
```typescript
class SocketService {
  private socket: Socket | null = null;
  private serverUrl = 'http://localhost:3002';

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(this.serverUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });
    }
    return this.socket;
  }
  // ... other methods
}
```
- Singleton pattern for socket management
- Automatic reconnection configuration
- Type-safe event handling methods

### Chat Interface (`frontend/src/components/ChatRoom.tsx`)
```typescript
const ChatRoom: React.FC<ChatRoomProps> = ({ username, onLeave }) => {
  const [messages, setMessages] = useState<(Message | SystemMessage)[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();
    
    socketService.onConnect(() => {
      setIsConnected(true);
      socketService.joinChat(username);
    });
    // ... other event listeners
  }, [username]);
  // ... component logic
};
```
- Real-time state management with React hooks
- WebSocket event handling integration
- UI updates based on socket events

## API Endpoints

### REST API Endpoints
- **GET** `/` - Server status check
- **GET** `/api/users` - Get current online users list

## Data Flow

1. **User Connection**: Frontend connects to Socket.io server
2. **Username Registration**: User enters username and joins chat
3. **Real-Time Communication**: Messages flow bidirectionally through WebSocket
4. **State Synchronization**: All clients receive updates simultaneously
5. **User Management**: Server tracks connections and broadcasts user list changes

## Type Definitions

### Message Types (`frontend/src/types.ts`)
```typescript
export interface Message {
  id: number;
  username: string;
  message: string;
  timestamp: Date;
}

export interface SystemMessage {
  username: string;
  message: string;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  joinedAt: Date;
}

export interface TypingUser {
  username: string;
  isTyping: boolean;
}
```

## Testing the Application

### Manual Testing
1. Start both servers as described above
2. Open multiple browser tabs/windows to `http://localhost:3000`
3. Enter different usernames in each tab
4. Test real-time messaging between tabs
5. Verify typing indicators work across sessions
6. Test connection status by stopping/starting backend server

### Socket Connection Testing
```bash
# Test server status
curl http://localhost:3002

# Test users API
curl http://localhost:3002/api/users
```

### Browser Developer Tools
- Check Console for socket connection logs
- Monitor Network tab for WebSocket connections
- Verify real-time message delivery

## Troubleshooting

### Common Issues
1. **Connection Failed**: Ensure backend server is running on port 3002
2. **CORS Errors**: Verify Socket.io CORS configuration matches frontend URL
3. **Port Conflicts**: Check if ports 3000/3002 are available
4. **Messages Not Delivered**: Check browser console for socket errors
5. **Typing Indicators Not Working**: Verify timeout cleanup in useEffect

### Error Messages
- "Socket connection error": Backend server unreachable or CORS issue
- "Disconnected": WebSocket connection lost, check server status
- Multiple "Connected" logs: Multiple socket instances, refresh page

### Connection Troubleshooting
```bash
# Check if backend is running
lsof -i :3002

# Check if frontend is running  
lsof -i :3000

# Kill conflicting processes
pkill -f "node server.js"
```

## Performance Considerations
- Message history is stored in memory (consider database for production)
- User list broadcasts on every connection change
- Typing indicators have automatic timeout to prevent memory leaks
- Socket connections are cleaned up on component unmount

## Security Considerations
- Input validation for usernames and messages
- Message length limiting (500 characters)
- No authentication implemented (suitable for development only)
- CORS configured for specific origin

## Future Enhancements
- User authentication and authorization
- Message persistence with database integration
- Private messaging capabilities
- File and image sharing
- Message reactions and emojis
- Chat rooms/channels
- Message encryption
- User avatars and profiles
- Push notifications
- Mobile responsive design improvements
- Rate limiting for message sending
- Admin controls and moderation features

## Dependencies

### Backend Dependencies
```json
{
  "express": "^5.1.0",
  "socket.io": "^4.8.1",
  "cors": "^2.8.5",
  "nodemon": "^3.1.10" (dev)
}
```

### Frontend Dependencies
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "socket.io-client": "^4.8.1",
  "typescript": "^4.9.5",
  "react-scripts": "5.0.1"
}
```

## Browser Compatibility
- Chrome/Chromium: Full support
- Firefox: Full support  
- Safari: Full support
- Edge: Full support
- IE11: Limited support (requires polyfills)

## Development Notes
- TypeScript provides compile-time type checking
- React Strict Mode may cause double connections in development
- Socket.io automatically falls back to polling if WebSocket fails
- Development server has hot reloading enabled

## Author
@admin

## License
ISC

---
*This experiment is part of Full Stack Development coursework, Semester 5*