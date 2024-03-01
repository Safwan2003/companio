import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanyProfile = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

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
          Authorization: token,
        },
      });

      const { name, email, address, category, phoneNumber } = res.data;
      setUserData({ name, email, address, category, phoneNumber });
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
        <p className="text-lg font-semibold mb-2">Name: {userData.name}</p>
        <p className="text-lg font-semibold mb-2">Email: {userData.email}</p>
        <p className="text-lg font-semibold mb-2">Address: {userData.address}</p>
        <p className="text-lg font-semibold mb-2">Category: {userData.category}</p>
        <p className="text-lg font-semibold mb-2">Phone Number: {userData.phoneNumber}</p>
      </div>
    </div>
  );
};

export default CompanyProfile;
