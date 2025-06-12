// routes/applicationRoute.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure storage as needed

// Upload fields: transcript, sop (1 file), lors (multiple)
const uploadFields = upload.fields([
  { name: 'transcript', maxCount: 1 },
  { name: 'sop', maxCount: 1 },
  { name: 'lors', maxCount: 3 }
]);

router.post('/apply', uploadFields, applicationController.createApplication);
router.get('/applications', applicationController.getAllApplications);
router.get('/applications/:id', applicationController.getApplicationById);
router.put('/applications/:id/status', applicationController.updateApplicationStatus);

module.exports = router;
