// models/application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  degrees: [{ type: String }], // dynamic fields
  transcript: { type: String }, // file URL or path
  sop: { type: String },
  lors: [{ type: String }], // array of file URLs
  status: { 
    type: String, 
    enum: ['submitted', 'under_review', 'accepted', 'rejected'], 
    default: 'submitted' 
  },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', applicationSchema);
