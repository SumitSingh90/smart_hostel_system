const express = require('express');
const {
  addStudent, addWorker, getAllComplaints, assignWorkerToComplaint, sendEmail
} = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken, requireRole('admin'));

router.post('/add-student', addStudent);
router.post('/add-worker', addWorker);
router.get('/complaints', getAllComplaints);
router.patch('/assign-worker/:complaintId', assignWorkerToComplaint);
router.post('/send-mail', sendEmail);

module.exports = router;
