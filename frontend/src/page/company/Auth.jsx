import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Auth = ({ authType, setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyCategory, setCompanyCategory] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const companyLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:2000/api/auth', {
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
          navigate('/companydashboard'); // Replace with your dashboard route
        });
      }
    } catch (error) {
      setError('Login failed. Check your credentials.');
      console.error('Login error:', error);
    }
  };

  const companyRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:2000/api/auth/register', {
        email: email,
        password: password,
        name: name,
        address: companyAddress,
        category: companyCategory,
        phoneNumber: phoneNumber,
      });

      if (res.data && res.data.token) {
        localStorage.setItem('authToken', res.data.token);

        // Alert and navigate to the dashboard
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Redirecting to the dashboard...',
        }).then(() => {
          navigate('/companydashboard'); // Replace with your dashboard route
        });
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(''); // Clear any previous errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      companyLogin(e);
    } else {
      companyRegister(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-md shadow-md">
        <div className="text-3xl font-bold mb-6 text-center">{isLogin ? 'Company Login' : ' Company Register'}</div>

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

          {!isLogin && (
            <>
              <label className="block text-gray-700 mb-2 mt-3">Name</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />

              <label className="block text-gray-700 mb-2 mt-3">Company Address</label>
              <input
                type='text'
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />

              <label className="block text-gray-700 mb-2 mt-3">Company Category</label>
              <input
                type='text'
                value={companyCategory}
                onChange={(e) => setCompanyCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />

              <label className="block text-gray-700 mb-2 mt-3">Phone Number</label>
              <input
                type='tel'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </>
          )}

          <button className={`bg-${isLogin ? 'green' : 'blue'}-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-${isLogin ? 'green' : 'blue'}-600 focus:outline-none w-full`} type='submit'>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        <p className="text-gray-600 text-center">
          {isLogin ? 'Not registered yet? ' : 'Already have an account? '}
          <span onClick={toggleForm} className="cursor-pointer text-green-500">
            {isLogin ? 'Register your company' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
