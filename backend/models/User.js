const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student', 'worker'], required: true },

  // student fields
  studentId: { type: String, index: true }, // e.g. S101
  roomNo: { type: String },
  cleaningSchedule: [
    {
      day: String,
      time: String
    }
  ],

  // worker fields
  workerId: { type: String, index: true }, // e.g. W201
  workerRole: { type: String }, // cleaning | mess | discipline
  tasks: [
    {
      complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
      status: { type: String, default: 'pending' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
