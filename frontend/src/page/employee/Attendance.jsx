import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Swal from 'sweetalert2';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory';

const Attendance = () => {
    const [socket, setSocket] = useState(null);
    const [clockedIn, setClockedIn] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [workingHours, setWorkingHours] = useState(0);
    const [data, setData] = useState(null);
    const [filterOption, setFilterOption] = useState('month');
    const [userCompanyDetails, setUserCompanyDetails] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:2000');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('clockIn', handleClockInNotification);
            socket.on('clockOut', handleClockOutNotification);
        }
    }, [socket]);

    useEffect(() => {
        fetchUserDetails();
        checkAttendanceStatus();
        getAttendanceData();
    }, [filterOption]);

    const handleClockInNotification = () => {
        Swal.fire({
            icon: 'success',
            title: 'Clock In Successful',
            text: 'You have successfully clocked in.',
        });
    };

    const handleClockOutNotification = () => {
        Swal.fire({
            icon: 'success',
            title: 'Clock Out Successful',
            text: 'You have successfully clocked out.',
        });
    };

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Token not found');
                return;
            }

            const response = await axios.get('http://localhost:2000/api/getuserdata', {
                headers: {
                    Authorization: `${token}`,
                },
            });

            setUserCompanyDetails(response.data.company);
        } catch (error) {
            console.error(error.message);
        }
    };

    const getAttendanceData = async () => {
        try {
            const res = await axios.get(`http://localhost:2000/api/getuserattendance`, {
                headers: {
                    Authorization: `${localStorage.getItem('authToken')}`
                },
                params: {
                    filterOption
                }
            });
            setData(res.data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const checkAttendanceStatus = async () => {
        try {
            const res = await axios.get(`http://localhost:2000/api/checkattendancestatus`, {
                headers: {
                    Authorization: `${localStorage.getItem('authToken')}`
                }
            });
            const { clockedIn, startTime, endTime } = res.data;
            setClockedIn(clockedIn);
            if (startTime) setStartTime(new Date(startTime));
            if (endTime) setEndTime(new Date(endTime));
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleClockInOut = async () => {
        if (clockedIn) {
            await clockOut();
        } else {
            await clockIn();
        }
    };

    const clockIn = async () => {
        try {
            const response = await axios.post('http://localhost:2000/api/clock-in', { startTime: new Date(), company: userCompanyDetails }, {
                headers: {
                    Authorization: `${localStorage.getItem('authToken')}`
                }
            });
            const { startTime } = response.data;
            setStartTime(new Date(startTime));
            setClockedIn(true);
            localStorage.setItem('startTime', startTime);
            localStorage.setItem('clockedIn', true);

            socket.emit('clockIn');
        } catch (error) {
            console.error('Error clocking in:', error);
        }
    };

    const clockOut = async () => {
        try {
            const response = await axios.post('http://localhost:2000/api/clock-out', { endTime: new Date(), company: userCompanyDetails }, {
                headers: {
                    Authorization: `${localStorage.getItem('authToken')}`
                }
            });
            const { endTime, duration } = response.data;
            setEndTime(new Date(endTime));
            setWorkingHours(duration);
            setClockedIn(false);
            localStorage.removeItem('startTime');
            localStorage.removeItem('clockedIn');

            socket.emit('clockOut');
        } catch (error) {
            console.error('Error clocking out:', error);
        }
    };

    const calculateDuration = (startTime, endTime) => {
        if (startTime && endTime) {
            const diffInMilliseconds = endTime.getTime() - startTime.getTime();
            const hours = diffInMilliseconds / (1000 * 60 * 60);
            return hours.toFixed(2);
        }
        return null;
    };

    const chartData = data
        ? data.map((attendance) => ({
              x: new Date(attendance.startTime).toLocaleDateString(),
              y: calculateDuration(new Date(attendance.startTime), new Date(attendance.endTime)),
          }))
        : [];

    return (
        <div className="Attendance bg-gray-100 p-4 rounded shadow">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Attendance</h1>
                {clockedIn ? (
                    <button
                        onClick={handleClockInOut}
                        className="py-2 px-4 rounded bg-red-500 hover:bg-red-600 text-white"
                    >
                        Clock out
                    </button>
                ) : (
                    <button
                        onClick={handleClockInOut}
                        className="py-2 px-4 rounded bg-green-500 hover:bg-green-600 text-white"
                    >
                        Clock in
                    </button>
                )}
                <select
                    className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                >
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                    <option value="week">Week</option>
                </select>
            </div>
            <div className="mb-4">
                <p className="font-semibold">Start Time: {startTime ? startTime.toLocaleString() : 'N/A'}</p>
                <p className="font-semibold">End Time: {endTime ? endTime.toLocaleString() : 'N/A'}</p>
                <p className="font-semibold">Total Working Hours: {workingHours} hours</p>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Attendance Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data &&
                        data.map((attendance, index) => (
                            <div key={index} className="border border-gray-200 rounded p-4">
                                <p>
                                    <span className="font-bold">Start Time:</span>{' '}
                                    {new Date(attendance.startTime).toLocaleString()}
                                </p>
                                <p>
                                    <span className="font-bold">End Time:</span>{' '}
                                    {attendance.endTime ? new Date(attendance.endTime).toLocaleString() : 'N/A'}
                                </p>
                                <p>
                                    <span className="font-bold">Duration:</span>{' '}
                                    {calculateDuration(new Date(attendance.startTime), new Date(attendance.endTime))}
                                    &nbsp;hours
                                </p>
                            </div>
                        ))}
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-2">Attendance Chart</h2>
                <div className="bg-white rounded shadow p-4">
                    <VictoryChart theme={VictoryTheme.material} height={400} width={600}>
                        <VictoryLine
                            style={{
                                data: { stroke: "#4299e1" },
                                parent: { border: "1px solid #cbd5e0" }
                            }}
                            data={chartData}
                            x="x"
                            y="y"
                        />
                        <VictoryAxis label="Date" />
                        <VictoryAxis dependentAxis label="Hours" />
                    </VictoryChart>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
