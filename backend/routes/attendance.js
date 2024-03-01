// routes/attendance.js

const express = require('express');
const router = express.Router();
const attendanceController = require('../controller/attendance');
const auth = require('../middleware/userauth');
const companyauth = require('../middleware/companyauth');

router.post('/clock-in', auth, attendanceController.clockIn);
router.post('/clock-out', auth, attendanceController.clockOut);
router.get('/getuserattendance', auth, attendanceController.getuserattendance);
router.get('/checkattendancestatus', auth, attendanceController.checkAttendanceStatus);




router.get('/getallemployeesattendance',companyauth, attendanceController.getEmployeeAttendance)
module.exports = router;
