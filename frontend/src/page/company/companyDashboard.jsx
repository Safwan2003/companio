import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';

const CompanyDashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('authToken');
    // Redirect to auth page
    navigate('/company');
  };

  return (
    <div className='flex flex-col h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center p-3 bg-blue-500'>
        <div className='font-bold text-2xl text-white uppercase'>Company Dashboard</div>
        <button onClick={logout} className='bg-red-500 p-2 px-3 rounded text-white font-semibold'>Logout</button>
      </div>
      
      {/* Main Content */}
      <div className='flex flex-grow'>
        {/* Sidebar */}
        <div className='w-full md:w-1/6 max-md:w-[15rem] bg-gray-100 p-4'>
          <h2 className='text-lg font-semibold mb-4'>Sidebar</h2>
          <ul className='space-y-2'>
            <li>
              <Link to='companyprofile' className='text-blue-500 cursor-pointer hover:font-bold'>Company Profile</Link>
            </li>
            <li>
              <Link to='employeecrud' className='text-blue-500 cursor-pointer hover:font-bold'>Employee Management</Link>
            </li>
            <li>
              <Link to='taskdashboard' className='text-blue-500 cursor-pointer hover:font-bold'>Task Management</Link>
            </li>
            <li>
              <Link to='analytics' className='text-blue-500 cursor-pointer hover:font-bold'>Analytics</Link>
            </li>
            <li>
              <Link to='attendancecompany' className='text-blue-500 cursor-pointer hover:font-bold'>Attendance</Link>
            </li>
            <li>
              {/* <Link to='/chat' className='text-blue-500 cursor-pointer hover:font-bold'>Chat</Link> */}
            </li>
            <li>
              <Link to='chatbot' className='text-blue-500 cursor-pointer hover:font-bold'>Ai chatbot</Link>
            </li>
          </ul>
        </div>
        
        {/* Content Area */}
        <div className='w-full md:w-5/6 p-4'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
