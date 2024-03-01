// controllers/attendance.controller.js

const Attendance = require('../models/attendance');

const clockIn = async (req, res) => {
    try {
        const { startTime,company } = req.body;
        const user = req.user.id; // Assuming user ID is available in request
        const newAttendance = new Attendance({ startTime, user,company });
        await newAttendance.save();
        res.status(201).json({ startTime });
    } catch (error) {
        console.error('Error clocking in:', error);
        res.status(500).send('Server Error');
    }
};

const clockOut = async (req, res) => {
    try {
        const { endTime,company } = req.body;
        const latestAttendance = await Attendance.findOne({ user: req.user.id, company}).sort({ startTime: -1 });
        latestAttendance.endTime = endTime;
        await latestAttendance.save();
        const duration = calculateDuration(latestAttendance.startTime, latestAttendance.endTime);
        res.status(200).json({ endTime, duration });
    } catch (error) {
        console.error('Error clocking out:', error);
        res.status(500).send('Server Error');
    }
};

const calculateDuration = (startTime, endTime) => {
    if (startTime && endTime) {
        const diffInMilliseconds = endTime.getTime() - startTime.getTime();
        const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours} hours ${minutes} minutes`;
    }
    return 'N/A';
};





const getEmployeeAttendance = async (req, res) => {
    try {
        // const company = req.company.id; // Assuming company ID is available in request
        const employeeAttendance = await Attendance.find({ company:req.company.id });
        res.json(employeeAttendance);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getuserattendance = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you're using user authentication middleware to get the user ID

        const userAttendance = await Attendance.find({ user: userId });

        res.json(userAttendance);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


const checkAttendanceStatus = async (req, res) => {
    try {
        const user = req.user.id;
        const latestAttendance = await Attendance.findOne({ user }).sort({ startTime: -1 });
        if (!latestAttendance || latestAttendance.endTime) {
            // User is not clocked in or already clocked out
            return res.json({ clockedIn: false, startTime: null, endTime: null });
        } else {
            // User is currently clocked in
            return res.json({ clockedIn: true, startTime: latestAttendance.startTime, endTime: null });
        }
    } catch (error) {
        console.error('Error checking attendance status:', error);
        res.status(500).send('Server Error');
    }
};
module.exports = {
    clockIn,
    clockOut,
    getuserattendance,
    checkAttendanceStatus,
    getEmployeeAttendance,

};
