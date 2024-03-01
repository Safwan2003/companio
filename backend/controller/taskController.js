const mongoose = require('mongoose');
const Task = require('../models/task');
const jwt = require('jsonwebtoken');
const Company = require('../models/company');
const User = require('../models/user');

const createTask = async (req, res) => {
  const { to, deadline, description } = req.body;

  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWTSECRET);

    if (!mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).json({ msg: 'Invalid ObjectId for to' });
    }

    const userExists = await User.findById(to);

    if (!userExists) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const task = new Task({
      from: decoded.company.id,
      to,
      deadline,
      description,
    });

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

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
    const id = req.params.id;
    const updateTask = await Task.findById(id);
    if (!updateTask) throw Error("Task not found");
    
    if (req.body.to) updateTask.to = req.body.to;
    if (req.body.description) updateTask.description = req.body.description;
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




const updatestatusbydeadline=async()=>{
  try {
  const statusvalue =  await Task.find({status,deadline})
    let current=Date.now()
         const statuscompleted = 'completed';

    if(current>deadline && !statuscompleted){
      const updatedTask = await Task.findByIdAndUpdate(taskId, { status:'overdue' }, { new: true });
// and make the request to company to extended it or not make the notificatioon system
    }
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
    
  }
}

const updateTaskStatusForUser = async (req, res) => {
  try {
    const {  taskId } = req.params;
    const { status } = req.body;
    // const userid =req.user.id
    const allowedStatusValues = ['completed', 'overdue', 'extended'];
    if (!allowedStatusValues.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ msg: 'Task not found or unauthorized' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};







const getalluserTaskById = async (req, res) => {
  try {
    const id = req.user.id;
    const tasks = await Task.find({ to: id }).populate('from'); // Populate user details
    const tasksWithUserAndCompanyNames = await Promise.all(tasks.map(async task => {
      try {
        const user = await getuser(task.from);
        const company = await getcompanyname(task.from.company); // Assuming company ID is stored in user's company field
        return {
          ...task.toObject(),
          user: user ? user.name : 'Unknown User', // Check if user exists before accessing name property
          company: company ? company.name : 'Unknown Company' // Check if company exists before accessing name property
        };
      } catch (error) {
        console.error(`Error fetching user/company: ${error.message}`);
        return {
          ...task.toObject(),
          user: 'Unknown User',
          company: 'Unknown Company'
        };
      }
    }));
    res.json(tasksWithUserAndCompanyNames);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
const getuser = async (param) => {
  const user = await User.findById(param);
  return user; // Return the fetched user data
};

const getcompanyname = async (param) => {
  const company = await Company.findById(param);
  return company; // Return the fetched company data
};


module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTask,
  updateTask,
  getalluserTaskById,
  updateTaskStatusForUser,
  
};
