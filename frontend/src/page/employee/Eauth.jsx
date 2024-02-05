import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const employeeLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:2000/api/auth/userlogin', {
        email: email,
        password: password,
      });

      if (res.data && res.data.token) {
        localStorage.setItem('authToken', res.data.token);

        // Alert and navigate to the dashboard
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Redirecting to the dashboard...',
        }).then(() => {
          navigate('/employeedashboard'); // Replace with your dashboard route
        });
      }
    } catch (error) {
      setError('Login failed. Check your credentials.');
      console.error('Login error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    employeeLogin(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-md shadow-md">
        <div className="text-3xl font-bold mb-6 text-center">Login</div>

        <form onSubmit={handleSubmit} className="mb-6">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />

          <label className="block text-gray-700 mb-2 mt-3">Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 mt-1"
            required
          />

          <button className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600 focus:outline-none w-full" type='submit'>
            Login
          </button>
        </form>

        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
