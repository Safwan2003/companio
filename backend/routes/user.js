const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/companyauth');
const userController = require('../controller/user');

// Route to create a new user
router.post('/createuser', [
    auth,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('designation').notEmpty().withMessage('Designation is required'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('phoneNumber').notEmpty().withMessage('Phone number is required'),
        body('qualification').notEmpty().withMessage('Qualification is required'),
    ],
], userController.createuser);

// Route to get user information
router.get('/getuser', auth, userController.getuser);

// Route to delete a user
router.delete('/deleteuser/:id', auth, userController.deleteuser);

// Route to edit user information
router.put('/edituser/:userId', [
    auth,
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('designation').optional().notEmpty().withMessage('Designation is required'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('password').optional().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('phoneNumber').optional().notEmpty().withMessage('Phone number is required'),
    body('qualification').optional().notEmpty().withMessage('Qualification is required'),
], userController.edituser);

module.exports = router;
