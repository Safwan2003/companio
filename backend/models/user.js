const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'admin'],
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
});

const User = mongoose.model('User', userSchema);
module.exports=User;