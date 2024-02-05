// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');
const auth = require('../middleware/userauth');

// POST /tasks - Create a new task
router.post('/tasks', auth,taskController.createTask);

// GET /tasks - Get all tasks
router.get('/tasks',auth, taskController.getAllTasks);

// GET /tasks/:id - Get a specific task by ID
router.get('/tasks/:id',auth, taskController.getTaskById);

// PUT /tasks/:id - Update a task by ID
router.put('/tasks/:id',auth, taskController.updateTask);

// DELETE /tasks/:id - Delete a task by ID
router.delete('/tasks/:id',auth, taskController.deleteTask);

module.exports = router;
 