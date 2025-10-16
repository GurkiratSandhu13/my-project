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

// Middleware
app.use(cors());
app.use(express.json());

// Store connected users
const users = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining the chat
  socket.on('user_join', (username) => {
    users.set(socket.id, {
      id: socket.id,
      username: username,
      joinedAt: new Date()
    });
    
    console.log(`${username} joined the chat`);
    
    // Broadcast to all clients that a user joined
    socket.broadcast.emit('user_joined', {
      username: username,
      message: `${username} joined the chat`,
      timestamp: new Date()
    });
    
    // Send list of online users to all clients
    io.emit('users_list', Array.from(users.values()));
  });

  // Handle new message
  socket.on('send_message', (data) => {
    const user = users.get(socket.id);
    if (user) {
      const messageData = {
        id: Date.now(),
        username: user.username,
        message: data.message,
        timestamp: new Date()
      };
      
      // Broadcast message to all connected clients
      io.emit('receive_message', messageData);
      console.log(`Message from ${user.username}: ${data.message}`);
    }
  });

  // Handle user typing indicator
  socket.on('typing', (data) => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('user_typing', {
        username: user.username,
        isTyping: data.isTyping
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`${user.username} disconnected`);
      
      // Remove user from the map
      users.delete(socket.id);
      
      // Notify other users
      socket.broadcast.emit('user_left', {
        username: user.username,
        message: `${user.username} left the chat`,
        timestamp: new Date()
      });
      
      // Update users list
      io.emit('users_list', Array.from(users.values()));
    }
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Real-time Chat Server is running!' });
});

// Get online users
app.get('/api/users', (req, res) => {
  res.json(Array.from(users.values()));
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});