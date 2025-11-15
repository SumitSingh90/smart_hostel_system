const express = require('express');
const { submitComplaint, getMyComplaints, setCleaningSchedule, viewMenu } = require('../controllers/studentController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken, requireRole('student'));

router.post('/complaint', submitComplaint);
router.get('/complaints', getMyComplaints);
router.post('/cleaning-schedule', setCleaningSchedule);
router.get('/menu', viewMenu);

module.exports = router;
