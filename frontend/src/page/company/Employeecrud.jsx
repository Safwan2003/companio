import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EmployeeCrud = () => {
  const [userList, setUserList] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [qualification, setQualification] = useState('');
  const [role, setRole] = useState('User'); // Default to 'User'
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        // Handle case where token is not available
        return;
      }

      const res = await axios.get('http://localhost:2000/api/user/getuser', {
        headers: {
          Authorization: `${token}`,
        },
      });

      setUserList(res.data.users);
    } catch (err) {
      console.error('Error fetching user list:', err);
    }
  };

  const addEmployee = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        // Handle case where token is not available
        return;
      }

      const res = await axios.post(
        'http://localhost:2000/api/user/createuser',
        {
          name,
          email,
          password,
          designation,
          phoneNumber,
          qualification,
          role,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (res.data && res.data.msg) {
        Swal.fire({
          icon: 'success',
          title: 'Employee Added!',
          text: 'Employee added successfully.',
        });
        fetchUserList();
        clearForm();
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error adding employee. Please try again.',
      });
    }
  };

  const editEmployee = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token || !editingUserId) {
        // Handle case where token or editingUserId is not available
        return;
      }

      const res = await axios.put(
        `http://localhost:2000/api/user/edituser/${editingUserId}`,
        {
          name,
          email,
          designation,
          phoneNumber,
          qualification,
          role,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (res.data && res.data.msg) {
        Swal.fire({
          icon: 'success',
          title: 'Employee Updated!',
          text: 'Employee details updated successfully.',
        });
        fetchUserList();
        clearForm();
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating employee. Please try again.',
      });
    }
  };

  const deleteEmployee = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        // Handle case where token is not available
        return;
      }

      const res = await axios.delete(`http://localhost:2000/api/user/deleteuser/${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (res.data && res.data.msg) {
        Swal.fire({
          icon: 'success',
          title: 'Employee Deleted!',
          text: 'Employee deleted successfully.',
        });
        fetchUserList();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error deleting employee. Please try again.',
      });
    }
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setDesignation('');
    setPhoneNumber('');
    setQualification('');
    setRole('User'); // Reset role to 'User'
    setEditingUserId(null);
  };

  const startEditing = (userId) => {
    const userToEdit = userList.find((user) => user._id === userId);
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setDesignation(userToEdit.designation);
      setPhoneNumber(userToEdit.phoneNumber);
      setQualification(userToEdit.qualification);
      setRole(userToEdit.role);
      setEditingUserId(userId);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Employee Management</h2>

      {/* Add/Update Employee Form */}
      <form className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>


       
        <div className="mb-4 relative">
  <label className="block text-gray-700 mb-2">Password</label>
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    onClick={(e) => { editingUserId && (e.preventDefault(), e.stopPropagation()) }}  
    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${editingUserId ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    required
    disabled={editingUserId ? true : false}
  />
</div>


        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Designation</label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Qualification</label>
          <input
            type="text"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
            onClick={editingUserId ? editEmployee : addEmployee}
          >
            {editingUserId ? 'Update Employee' : 'Add Employee'}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
            onClick={clearForm}
          >
            Clear
          </button>
        </div>
      </form>

      {/* Employee List */}
      <h2 className="text-xl font-bold mb-2">Employee List</h2>
      <ul>
        {userList.map((user) => (
          <li key={user._id} className="border-b py-2">
            <p className="text-lg font-semibold">Name: {user.name}</p>
            <p className="text-lg font-semibold">Email: {user.email}</p>
            {/* Display other user information as needed */}
            <div className="flex space-x-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={() => startEditing(user._id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 focus:outline-none"
                onClick={() => deleteEmployee(user._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeCrud;
