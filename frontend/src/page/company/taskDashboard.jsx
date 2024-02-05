// components/Company.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Company = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    to: '',
    deadline: '',
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');  // Update the URL based on your backend route
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskCreation = async () => {
    try {
      const response = await axios.post('/api/tasks', taskData);  // Update the URL based on your backend route
      console.log('Task created:', response.data);
      setTasks([...tasks, response.data]);  // Update the local state to include the new task
    } catch (error) {
      console.error('Error creating task:', error.message);
    }
  };

  const handleTaskUpdate = async (taskId) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, taskData);  // Update the URL based on your backend route
      console.log('Task updated:', response.data);

      // Update the local state to reflect the changes
      setTasks(tasks.map((task) => (task._id === taskId ? response.data : task)));
    } catch (error) {
      console.error('Error updating task:', error.message);
    }
  };

  const handleTaskDeletion = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);  // Update the URL based on your backend route
      console.log('Task deleted:', taskId);

      // Update the local state to exclude the deleted task
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  return (
    <div>
      <h2>Create Task</h2>
      <form>
        <label>To:</label>
        <input
          type="text"
          value={taskData.to}
          onChange={(e) => setTaskData({ ...taskData, to: e.target.value })}
        />

        <label>Deadline:</label>
        <input
          type="date"
          value={taskData.deadline}
          onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
        />

        <button type="button" onClick={handleTaskCreation}>
          Create Task
        </button>
      </form>

      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.from} to {task.to} - Deadline: {task.deadline}
            <button type="button" onClick={() => handleTaskUpdate(task._id)}>
              Update
            </button>
            <button type="button" onClick={() => handleTaskDeletion(task._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Company;
