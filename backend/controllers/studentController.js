const Complaint = require('../models/Complaint');
const Menu = require('../models/Menu');
const User = require('../models/User');

/**
 * POST /student/complaint
 */
const submitComplaint = async (req, res, next) => {
  try {
    const { category, description } = req.body;
    if (!category || !description) return res.status(400).json({ success: false, message: 'category and description required', data: null });

    const complaint = new Complaint({
      category,
      description,
      studentRef: req.user._id
    });
    await complaint.save();

    res.status(201).json({ success: true, message: 'Complaint submitted', data: { complaintId: complaint._id } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /student/complaints
 */
const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ studentRef: req.user._id }).populate('assignedWorkerRef', 'name workerId');
    res.json({ success: true, message: 'Complaints fetched', data: complaints });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /student/cleaning-schedule
 */
const setCleaningSchedule = async (req, res, next) => {
  try {
    const { day, time } = req.body;
    if (!day || !time) return res.status(400).json({ success: false, message: 'day and time required', data: null });

    const user = await User.findById(req.user._id);
    user.cleaningSchedule.push({ day, time });
    await user.save();

    res.json({ success: true, message: 'Cleaning schedule updated', data: user.cleaningSchedule });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /student/menu
 */
const viewMenu = async (req, res, next) => {
  try {
    // return all menus or filter by date
    const menus = await Menu.find().sort({ date: -1 });
    res.json({ success: true, message: 'Menu fetched', data: menus });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitComplaint, getMyComplaints, setCleaningSchedule, viewMenu };
