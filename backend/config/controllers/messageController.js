import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { sendEmail } from './emailService.js';
import { getFileUrl } from './fileUpload.js';

// Start new conversation
export const startConversation = async (req, res) => {
  try {
    const { participants, subject } = req.body;
    
    // Ensure participants include current user
    if (!participants.includes(req.user.id)) {
      participants.push(req.user.id);
    }
    
    const conversation = new Conversation({
      participants,
      subject,
      createdBy: req.user.id
    });
    
    await conversation.save();
    
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const attachments = req.files?.map(file => ({
      name: file.originalname,
      path: file.path,
      url: getFileUrl(file.filename)
    }));
    
    const message = new Message({
      conversation: conversationId,
      sender: req.user.id,
      content,
      attachments
    });
    
    await message.save();
    
    // Add to conversation
    await Conversation.findByIdAndUpdate(
      conversationId,
      { $push: { messages: message._id }, lastMessage: Date.now() }
    );
    
    // Send email notification to participants
    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'email name');
    
    for (const participant of conversation.participants) {
      if (participant._id.toString() !== req.user.id.toString()) {
        await sendEmail({
          recipient: participant.email,
          subject: `New message in: ${conversation.subject}`,
          template: 'message-notification',
          context: {
            name: participant.name,
            senderName: req.user.name,
            conversationId,
            content: content.substring(0, 100) + '...',
            link: `${process.env.CLIENT_URL}/messages/${conversationId}`
          }
        });
      }
    }
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get conversation messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId
    })
    .populate('sender', 'name avatar')
    .sort('createdAt');
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};