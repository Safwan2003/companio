// CompanyDashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmployeeCrud from './Emplyeecrud';

const CompanyDashboard = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const logout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('authToken');
    // Redirect to auth page
    navigate('/company');
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        // Handle case where token is not available
        navigate('/company'); // Redirect to auth page
        return;
      }

      const res = await axios.get('http://localhost:2000/api/auth', {
        headers: {
          Authorization: `${token}`,
        },
      });

      const { name, email } = res.data;
      setUserData({ name, email });
    } catch (err) {
      console.error('Error fetching user data:', err);

      if (err.response && err.response.status === 401) {
        // Unauthorized, redirect to auth
        navigate('/company');
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Company Dashboard</h1>
        {/* Display user data as needed */}
        <p className="text-lg font-semibold mb-2">Name: {userData.name}</p>
        <p className="text-lg font-semibold mb-4">Email: {userData.email}</p>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-red-600 focus:outline-none"
          onClick={logout}
        >
          LOGOUT
        </button>

        <EmployeeCrud />
      </div>
    </div>
  );
};

export default CompanyDashboard;
