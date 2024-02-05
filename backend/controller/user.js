const { validationResult } = require('express-validator');
const User = require('../models/user')
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken')
// Create a new user
 const createuser = async (req, res) => {
  const { name, designation, email, password, phoneNumber, qualification } = req.body;

  try {
    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ email });

    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWTSECRET); // Replace 'your_secret_key' with your actual secret key


    if (existingUser) {
      return res.status(401).json({ error: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      name,
      designation,
      email,
      password,
      phoneNumber,
      qualification,
      company:decoded.company.id,       
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ msg: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get users
const getuser = async (req, res) => {
  try {

const users = await User.find({company:req.company.id}).select('-password').sort({
  created_at:-1,
})
    
    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a user by ID
 const deleteuser = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};










 const edituser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.params.userId;

  try {
    // Find the user by ID
    let existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user fields
    if (req.body.name) existingUser.name = req.body.name;
    if (req.body.designation) existingUser.designation = req.body.designation;
    if (req.body.email) existingUser.email = req.body.email;
    if (req.body.password) existingUser.password = req.body.password;
    if (req.body.phoneNumber) existingUser.phoneNumber = req.body.phoneNumber;
    if (req.body.qualification) existingUser.qualification = req.body.qualification;

    // Save the updated user to the database
    //  existingUser = await User.findByIdAndUpdate(userId);

    await existingUser.save();

    res.status(200).json({ msg: 'User updated successfully', user: existingUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


module.exports={createuser,getuser,deleteuser,edituser}