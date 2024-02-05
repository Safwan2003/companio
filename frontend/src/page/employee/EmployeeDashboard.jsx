import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [userdetails, setUserdetails] = useState({}); // Set initial state to an empty object

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error("Token not found");
        navigate('/employee');
      }
      const response = await axios.get('http://localhost:2000/api/auth/getuserdetails', {
  headers: {
    Authorization: `${token}`,
  },
});


      setUserdetails(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    navigate('/employee');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className='flex justify-between items-center p-6 bg-blue-500 text-white'>
        <div className='text-2xl font-bold'>Employee Dashboard</div>
        <button onClick={logout} className='bg-red-500 text-white p-2 px-4 rounded-lg shadow'>
          LOGOUT
        </button>
      </div>

      <div>
        <p>Name: {userdetails.name}</p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
