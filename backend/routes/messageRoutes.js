import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { uploadFile } from '../services/fileUpload.js';
import { 
  startConversation, 
  sendMessage, 
  getMessages 
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/conversations', authenticate, startConversation);
router.post(
  '/messages', 
  authenticate, 
  uploadFile('attachments', 5), 
  sendMessage
);
router.get('/messages/:conversationId', authenticate, getMessages);

export default router;