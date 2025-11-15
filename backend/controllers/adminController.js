const User = require('../models/User');
const Complaint = require('../models/Complaint');
const { sendMail } = require('../utils/mailer');

/**
 * POST /admin/add-student
 */
const addStudent = async (req, res, next) => {
  try {
    const { name, studentId, email, password, roomNo } = req.body;
    if (!name || !studentId || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields', data: null });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already exists', data: null });

    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(password, 10);

    const student = new User({
      name, email, password: hashed, role: 'student', studentId, roomNo
    });
    await student.save();
    res.status(201).json({ success: true, message: 'Student added successfully', data: null });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /admin/add-worker
 */
const addWorker = async (req, res, next) => {
  try {
    const { name, workerId, role: workerRole, email, password } = req.body;
    if (!name || !workerId || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields', data: null });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already exists', data: null });

    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(password, 10);

    const worker = new User({
      name, email, password: hashed, role: 'worker', workerId, workerRole
    });
    await worker.save();
    res.status(201).json({ success: true, message: 'Worker added successfully', data: null });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/complaints
 */
const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find().populate('studentRef', 'name studentId').populate('assignedWorkerRef','name workerId workerRole');
    res.json({ success: true, message: 'Complaints fetched', data: complaints });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /admin/assign-worker/:complaintId
 */
const assignWorkerToComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { workerId } = req.body; // this is worker._id or worker.workerId? we'll accept both
    if (!workerId) return res.status(400).json({ success: false, message: 'workerId required', data: null });

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found', data: null });

    let worker = await User.findOne({ $or: [{ _id: workerId }, { workerId }] , role: 'worker' });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found', data: null });

    complaint.assignedWorkerRef = worker._id;
    complaint.status = 'assigned';
    await complaint.save();

    // add a task ref to worker
    worker.tasks.push({ complaintId: complaint._id, status: 'pending' });
    await worker.save();

    res.json({ success: true, message: 'Worker assigned successfully', data: null });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /admin/send-mail
 */
const sendEmail = async (req, res, next) => {
  try {
    const { to, subject, text } = req.body;
    if (!to || !subject) return res.status(400).json({ success: false, message: 'to and subject required', data: null });
    await sendMail({ to, subject, text });
    res.json({ success: true, message: 'Email sent successfully', data: null });
  } catch (err) {
    next(err);
  }
};

module.exports = { addStudent, addWorker, getAllComplaints, assignWorkerToComplaint, sendEmail };
