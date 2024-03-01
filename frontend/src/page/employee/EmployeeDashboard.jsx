import React from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';

const EmployeeDashboard = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('authToken');
        navigate('/employee');
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <div className="bg-blue-500 p-6 text-white flex justify-between items-center">
                <div className="text-2xl font-bold">Employee Dashboard</div>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white p-2 px-4 rounded-lg shadow hover:bg-red-600 transition duration-300"
                >
                    LOGOUT
                </button>
            </div>

            <div className="flex">
                <div className="w-1/4 bg-gray-200 p-4 h-screen overflow-y-auto">
                    <p className="text-lg font-semibold mb-4">Navigation</p>
                    <ul>
                        <li className="mb-2">
                            <Link to="task" className='text-blue-500 cursor-pointer hover:font-bold'>
                                Tasks
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="profile" className='text-blue-500 cursor-pointer hover:font-bold'>
                                Profile
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="attendance" className='text-blue-500 cursor-pointer hover:font-bold'>
                                Attendance
                            </Link>
                        </li>
                        <li>
              <Link to='/chat' className='text-blue-500 cursor-pointer hover:font-bold'>Chat</Link>
            </li>
            <li>
              <Link to='chatbot' className='text-blue-500 cursor-pointer hover:font-bold'>Ai chatbot</Link>
            </li>
                        {/* Add more navigation items as needed */}
                    </ul>
                </div>

                <div className="flex-grow p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
