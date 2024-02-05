const mongoose = require('mongoose');
const Task = require('../models/task');
const jwt = require('jsonwebtoken'); // Import JWT library
const Company = require('../models/company');
const User = require('../models/user');

const createTask = async (req, res) => {
  const { to, deadline } = req.body;

  try {
    // Extract user information from the JWT token
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWTSECRET); // Replace 'your_secret_key' with your actual secret key
    console.log(decoded); // Log decoded token
    
  
    // Check if the 'to' is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).json({ msg: 'Invalid ObjectId for to' });
    }

    // Check if the referenced User exists
    const userExists = await User.findById(to);

    if (!userExists) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const task = new Task({
      from: decoded.company.id, // Access company ID directly from decoded token
      to,
      deadline,
    });

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Other functions remain unchanged


const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) throw Error("Task not found");
    res.json(deletedTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const id = req.params.id; // Change from req.param.id to req.params.id
    const updateTask = await Task.findById(id);
    if (!updateTask) throw Error("Task not found");
    
    if (req.body.to) updateTask.to = req.body.to;
    if (req.body.deadline) updateTask.deadline = req.body.deadline;
    
    await updateTask.save();
    res.json(updateTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

const getTaskById = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTask,
  updateTask,
};
