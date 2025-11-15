const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Menu = require('../models/Menu');

/**
 * GET /worker/tasks
 */
const getAssignedTasks = async (req, res, next) => {
  try {
    // worker's tasks are embedded in user.tasks or find complaints where assignedWorkerRef is worker
    const tasks = await Complaint.find({ assignedWorkerRef: req.user._id }).populate('studentRef', 'name studentId');
    res.json({ success: true, message: 'Tasks fetched', data: tasks });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /worker/mark-done/:complaintId
 */
const markTaskDone = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findOne({ _id: complaintId, assignedWorkerRef: req.user._id });
    if (!complaint) return res.status(404).json({ success: false, message: 'Task not found or not assigned to you', data: null });

    complaint.status = 'done';
    await complaint.save();

    // update worker tasks embedded list if present
    const worker = await User.findById(req.user._id);
    if (worker && worker.tasks) {
      const t = worker.tasks.find(x => String(x.complaintId) === String(complaint._id));
      if (t) t.status = 'done';
      await worker.save();
    }

    res.json({ success: true, message: 'Task marked completed', data: null });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /worker/menu
 */
const addMenu = async (req, res, next) => {
  try {
    const { date, mealType, items } = req.body;
    if (!date || !mealType || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'date, mealType and items[] required', data: null });
    }

    const menu = new Menu({ date, mealType, items, createdBy: req.user._id });
    await menu.save();
    res.status(201).json({ success: true, message: 'Menu added successfully', data: menu });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /worker/menu
 */
const viewAllMenus = async (req, res, next) => {
  try {
    const menus = await Menu.find().sort({ date: -1 });
    res.json({ success: true, message: 'Menus fetched', data: menus });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAssignedTasks, markTaskDone, addMenu, viewAllMenus };
