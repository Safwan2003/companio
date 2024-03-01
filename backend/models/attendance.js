// attendance.model.js

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Adjust the reference model as per your user model
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company", // Adjust the reference model as per your user model
        required: true,
    },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
