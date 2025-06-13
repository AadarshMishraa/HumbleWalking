import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Message from './models/Message.js';
import Conversation from './models/Conversation.js';

// Import routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import universityRoutes from './routes/universityRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join conversation room
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });
  
  // Send and receive messages
  socket.on('send-message', async (messageData) => {
    try {
      const message = new Message({
        conversation: messageData.conversationId,
        sender: messageData.senderId,
        content: messageData.content
      });
      
      await message.save();
      
      // Update conversation
      await Conversation.findByIdAndUpdate(
        messageData.conversationId,
        { $push: { messages: message._id }, lastMessage: Date.now() }
      );
      
      // Emit to all participants in the conversation
      io.to(messageData.conversationId).emit('receive-message', {
        ...message.toObject(),
        sender: { _id: messageData.senderId, name: messageData.senderName }
      });
      
    } catch (error) {
      console.error('Socket message error:', error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/applications', applicationRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});