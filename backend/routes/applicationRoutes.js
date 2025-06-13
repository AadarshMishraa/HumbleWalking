// routes/applicationRoute.js
import express from 'express';
import { createApplication, getAllApplications, getApplicationById, updateApplicationStatus } from '../controllers/applicationController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure storage as needed

// Upload fields: transcript, sop (1 file), lors (multiple)
const uploadFields = upload.fields([
  { name: 'transcript', maxCount: 1 },
  { name: 'sop', maxCount: 1 },
  { name: 'lors', maxCount: 3 }
]);

router.post('/apply', uploadFields, createApplication);
router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplicationById);
router.put('/applications/:id/status', updateApplicationStatus);

export default router;
