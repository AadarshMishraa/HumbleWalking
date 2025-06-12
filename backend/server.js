import http from 'http';
import { Server } from 'socket.io';
import Message from './models/Message.js';

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