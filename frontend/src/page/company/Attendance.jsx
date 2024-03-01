import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Swal from 'sweetalert2';

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [employeeNames, setEmployeeNames] = useState([]);
    const [filteredDate, setFilteredDate] = useState(new Date().toISOString().split('T')[0]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:2000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        newSocket.on('notification', (message) => {
            // Use SweetAlert2 for notifications
            Swal.fire({
                icon: 'info',
                title: 'Notification',
                text: message,
                timer: 3000,
                timerProgressBar: true,
                toast: true,
                position: 'top-end',
                showConfirmButton: false
            });
        });

        newSocket.on('attendanceUpdate', (updatedData) => {
            setAttendanceData(updatedData);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        getEmployeeAttendance();
    }, []);

    useEffect(() => {
        fetchEmployeeNames();
    }, [attendanceData]);

    const getEmployeeAttendance = async () => {
        try {
            const res = await axios.get('http://localhost:2000/api/getallemployeesattendance', {
                headers: {
                    Authorization: localStorage.getItem('authToken')
                }
            });
            const sortedData = res.data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
            setAttendanceData(sortedData);
        } catch (error) {
            console.error('Error fetching attendance:', error.message);
        }
    };

    const formatTime = (timeString) => {
        const time = new Date(timeString);
        return time.toLocaleString();
    };

    const fetchEmployeeNames = async () => {
        const names = await Promise.all(attendanceData.map(async (record) => {
            try {
                const res = await axios.get(`http://localhost:2000/api/getuserdata/${record.user}`, {
                    headers: {
                        Authorization: localStorage.getItem('authToken'),
                    },
                });
                return res.data.name;
            } catch (err) {
                console.error('Error fetching user:', err);
                return '';
            }
        }));
        setEmployeeNames(names);
    };

    const filteredData = attendanceData.filter(record => record.startTime.includes(filteredDate));

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Employee Attendance</h2>
            <div className="mb-4">
                <label htmlFor="datePicker" className="mr-2">Select Date:</label>
                <input 
                    type="date" 
                    id="datePicker" 
                    value={filteredDate} 
                    onChange={(e) => setFilteredDate(e.target.value)} 
                    className="border border-gray-300 rounded-md px-2 py-1"
                />
            </div>
            {filteredData.length > 0 && employeeNames.length > 0 ? (
                <div className="border border-gray-200 p-4 rounded-md">
                    {filteredData.map((record, index) => (
                        <div key={index} className="mb-4">
                            <p><strong>Employee Name:</strong> {employeeNames[index]}</p>
                            <p><strong>Start Time:</strong> {formatTime(record.startTime)}</p>
                            <p><strong>End Time:</strong> {formatTime(record.endTime)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No attendance data available for the selected date</p>
            )}
        </div>
    );
};

export default Attendance;
