const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');
const auth = require('../middleware/companyauth');
const userauth = require('../middleware/userauth');

router.post('/tasks', auth, taskController.createTask);
router.get('/tasks', auth, taskController.getAllTasks);
router.get('/tasks/:id', auth, taskController.getTaskById);
router.put('/tasks/:id', auth, taskController.updateTask);
router.delete('/tasks/:id', auth, taskController.deleteTask);

// router.get('/tasksforuser/:userid', auth, taskController.getalluserTaskById);
router.get('/tasksforuser', userauth, taskController.getalluserTaskById);
router.put('/tasksforuser/:taskId', auth, taskController.updateTaskStatusForUser);

module.exports = router;
