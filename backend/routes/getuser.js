// Ensure you have the required imports at the top of the file
const User = require('../models/user');
const Company = require('../models/company');
const auth = require('../middleware/userauth');
const companyauth = require('../middleware/companyauth');
const express = require('express');
const router = express.Router();

router.get('/getuserdata', auth, async (req, res) => {
    try {
        const id = req.user.id;
        console.log(id);
        const userdata = await User.findById(id);
        res.json(userdata);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/getuserdata/:userid', companyauth, async (req, res) => {
    try {
        const id = req.params.userid;
        const userdata = await User.findById(id);
        if (!userdata) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(userdata);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
});








// Get all users for chat
router.get('/getusersforchat', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        const { company } = user;
        
        const getCompany = await Company.findById(company).select('-password');
        const allColleagues = await User.find({ company }).select('-password');

        // Constructing the response object
        const responseData = {
            company: getCompany,
            colleagues: allColleagues
        };

        res.json(responseData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});











module.exports = router;
