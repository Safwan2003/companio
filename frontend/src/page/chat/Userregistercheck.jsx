import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    phoneNumber: '',
    avatar: '' // This will hold the selected file
  });

  const handleChange = e => {
    if (e.target.name === 'avatar') {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(e.target.files[0]);
      fileReader.onload = () => {
        setFormData({ ...formData, [e.target.name]: fileReader.result });
      };
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };


  const handleSubmit = async e => {
    e.preventDefault();

    // Create form data object
    const { userName, email, password, phoneNumber,avatar } = formData;

    // Create userData object
    const userData = {
      avatar:  avatar, // If avatar is not selected, send an empty string
      userName,
      email,
      password,
      phoneNumber,
    };

    try {
      console.log(userData);
      // console.log(userData.avatar)      // Make POST request to backend endpoint
      // const res = await axios.post('https://mechanic-system-backend-bano-qabil-mern.vercel.app/api/auth/userregister', userData);
      const res = await axios.post('http://localhost:5000/api/auth/userregister', userData);

      console.log(res.data); // Log response from the backend
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'You have successfully registered.'
      });
      // Handle success (e.g., show a success message to the user)
    } catch (err) {
      console.error(err.response.data); // Log error response from the backend
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'An error occurred during registration. Please try again.'
      });
      // Handle error (e.g., show an error message to the user)
    }
  };







  return (
    <div className="container mx-auto max-w-md p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl mb-4">User Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="userName" className="block mb-1">Full Name</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block mb-1">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="avatar" className="block mb-1">Avatar</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Register</button>
      </form>
    </div>
  );
};

export default UserRegister;
