const express = require('express');
const { getAssignedTasks, markTaskDone, addMenu, viewAllMenus } = require('../controllers/workerController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken, requireRole('worker'));

router.get('/tasks', getAssignedTasks);
router.patch('/mark-done/:complaintId', markTaskDone);
router.post('/menu', addMenu);
router.get('/menu', viewAllMenus);

module.exports = router;
