const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  category: { type: String, enum: ['food', 'discipline', 'cleaning'], required: true },
  description: { type: String, required: true },
  studentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedWorkerRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending','assigned','done'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
