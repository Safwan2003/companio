import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const TaskDashboard = () => {
  const [userList, setUserList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    getEmployees();
    getTasks(); // Fetch tasks when the component mounts
  }, []);

  const getEmployees = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        // Handle case where token is not available
        return;
      }

      const res = await axios.get('http://localhost:2000/api/user/getuser', {
        headers: {
          Authorization: token,
        },
      });

      setUserList(res.data.users);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getTasks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://localhost:2000/api/tasks', {
        headers: {
          Authorization: token,
        },
      });
      setTasks(res.data.tasks);
    } catch (error) {
      console.error(error.message);
    }
  };

  const createForm = async (formData) => {
    try {
console.log(formData)     
 const res = await axios.post('http://localhost:2000/api/tasks', formData, {
        headers: {
          Authorization: `${localStorage.getItem('authToken')}`,
        },
      });
      console.log('Task created successfully:', res.data);
      Swal.fire('Success', 'Task created successfully!', 'success');
      getTasks(); // Refresh the task list after creating a new task
    } catch (error) {
      console.error('Error creating task:', error.message);
      Swal.fire('Error', 'Failed to create task', 'error');
    }
  };
  

  const handleCreateTask = () => {
    const userListOptions = userList
    .map((user) => `<option value="${user._id}">${user.name}</option>`)
    .join('');


    Swal.fire({
      title: 'Create Task',
      html: `
      <div>
        <label for="to" class="block text-sm font-bold mb-2">To:</label>
        <select
          id="to"
          class="w-full border rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
        >
          <option value="" disabled selected>Select recipient</option>
          ${userListOptions}
        </select>
      </div>
      <div>
        <label for="description" class="block text-sm font-bold mb-2">Task Description:</label>
        <textarea
          id="description"
          class="w-full border rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
          rows="3"
          placeholder="Enter task description"
        ></textarea>
      </div>
      <div>
        <label for="deadline" class="block text-sm font-bold mb-2">Deadline:</label>
        <input
          type="datetime-local"
          id="deadline"
          class="w-full border rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
        />
      </div>`,
     showCancelButton: true,
      confirmButtonText: 'Create Task',
      preConfirm: () => {
        const selectedUserId = document.getElementById('to').value; // Get the selected value from the dropdown
        const formData = {
          to: selectedUserId,
          description: document.getElementById('description').value,
          deadline: document.getElementById('deadline').value,
        };
        createForm(formData);
      },
      
    });
  };

  const editTask = async (taskId) => {
    try {
      const token = localStorage.getItem('authToken');
      const taskData = await axios.get(`http://localhost:2000/api/tasks/${taskId}`, {
        headers: {
          Authorization: token,
        },
      });
  
      if (taskData) {
        const userListOptions = userList
          .map((user) => `<option value="${user._id}">${user.name}</option>`)
          .join('');
  
        Swal.fire({
          title: 'Edit Task',
          html: `
            <div>
              <label for="to" class="block text-sm font-bold mb-2">To:</label>
              <select
                id="to"
                class="w-full border rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>Select recipient</option>
                ${userListOptions}
              </select>
            </div>
            <div>
              <label for="description" class="block text-sm font-bold mb-2">Task Description:</label>
              <textarea
                id="description"
                class="w-full border rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                rows="3"
                placeholder="Enter task description"
              >${taskData.data.description}</textarea>
            </div>
            <div>
              <label for="deadline" class="block text-sm font-bold mb-2">Deadline:</label>
              <input
                type="datetime-local"
                id="deadline"
                class="w-full border rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                value="${taskData.data.deadline}"
              />
            </div>`,
          showCancelButton: true,
          confirmButtonText: 'Save Changes',
          preConfirm: async () => {
            const selectedUserId = document.getElementById('to').value; // Get the selected value from the dropdown
            const editedDescription = document.getElementById('description').value;
            const editedDeadline = document.getElementById('deadline').value;
  
            try {
              const updateData = {
                to: selectedUserId,
                description: editedDescription,
                deadline: editedDeadline,
              };
  
              const updateRes = await axios.put(`http://localhost:2000/api/tasks/${taskId}`, updateData, {
                headers: {
                  Authorization: token,
                },
              });
  
              console.log('Task updated successfully:', updateRes.data);
              Swal.fire('Success', 'Task updated successfully!', 'success');
              getTasks(); // Refresh the task list after updating a task
            } catch (updateError) {
              console.error('Error updating task:', updateError.message);
              Swal.fire('Error', 'Failed to update task', 'error');
            }
          },
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  
  


  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:2000/api/tasks/${taskId}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(`Deleting Task ${taskId}`);
      getTasks(); // Refresh the task list after deleting a task
    } catch (error) {
      console.error(error.message);
    }
  };
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">TASK MANAGEMENT</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4"
        onClick={handleCreateTask}
      >
        Create Task
      </button>
      <div>
        {tasks.map((task) => (
          <div key={task._id} className="border p-4 mb-4">
     <p>
              <strong>To:</strong> {userList.find(user => user._id === task.to)?.name || task.to}
            </p>

            <p>
              <strong>Description:</strong> {task.description}
            </p>
            <p>
              <strong>Assigned Date:</strong> {task.date}
            </p>
            <p>
              <strong>Deadline:</strong> {task.deadline}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md mb-2"
              onClick={() => editTask(task._id)}
            >
              Edit Task
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
              onClick={() => deleteTask(task._id)}
            >
              Delete Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDashboard;
