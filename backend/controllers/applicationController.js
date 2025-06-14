// controllers/applicationController.js
const Application = require('../models/application');

// Create new application
exports.createApplication = async (req, res) => {
  try {
    const { name, email, degrees } = req.body;
    const files = req.files;

    const newApp = new Application({
      name,
      email,
      degrees,
      transcript: files?.transcript?.[0]?.path || '',
      sop: files?.sop?.[0]?.path || '',
      lors: (files?.lors || []).map(file => file.path),
    });

    await newApp.save();
    res.status(201).json({ message: 'Application submitted', data: newApp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all applications (for admin)
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find();
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Not found' });
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update application status (admin action)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: 'Status updated', data: updatedApp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
