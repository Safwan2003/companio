import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeTask = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const res = await axios.get('http://localhost:2000/api/tasksforuser', {
        headers: {
          Authorization: authToken
        }
      });
    //   console.log('Tasks:', res.data); // Log the received tasks data

      setTasks(res.data); // Assuming response contains tasks data
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Employee Tasks</h1>
      <div className="grid grid-cols-1 gap-4">
      {tasks.map(task => (
  <div key={task._id} className="bg-white shadow p-4 rounded-lg">
    <h2 className="text-xl font-bold mb-2">Task Title: {task.description}</h2>
    <p>From: {task.from ? task.from.name || task.from.username || 'Unknown' : 'Unknown'}</p>
    <p>To: {task.to ? task.to.name || task.to.username || 'Unknown' : 'Unknown'}</p>
    <p>Task To Object: {console.log('task.to:', task.to)}</p> {/* Log task.to directly here */}
    <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Not specified'}</p>
    <p>Status: {task.status}</p>
    {/* Add more details of the task here */}
  </div>
))}



{tasks.length === 0 && <p>No tasks found.</p>}
      </div>
    </div>
  );
};

export default EmployeeTask;
