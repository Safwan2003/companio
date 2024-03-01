import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeProfile = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [companyDetails, setCompanyDetails] = useState(null);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Token not found');
                navigate('/employee');
            }

            const response = await axios.get('http://localhost:2000/api/getuserdata', {
                headers: {
                    Authorization: `${token}`,
                },
            });

            setUserDetails(response.data);
            fetchCompanyDetails(response.data.company);
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchCompanyDetails = async (companyId) => {
        try {
            if (!companyId) {
                console.error('Company ID not found');
                return;
            }

            const response = await axios.get(`http://localhost:2000/api/auth/${companyId}`, {
                headers: {
                    Authorization: `${localStorage.getItem('authToken')}`,
                },
            });

            setCompanyDetails(response.data);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="w-3/4 p-6">
            {userDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <p className="text-lg font-semibold">User Details</p>
                        <p className="mb-2">Name: {userDetails.name}</p>
                        <p className="mb-2">Designation: {userDetails.designation}</p>
                        <p className="mb-2">Email: {userDetails.email}</p>
                        <p className="mb-2">Phone Number: {userDetails.phoneNumber}</p>
                        <p className="mb-2">Qualification: {userDetails.qualification}</p>
                    </div>

                    {companyDetails && (
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <p className="text-lg font-semibold">Company Details</p>
                            <p className="mb-2">Name: {companyDetails.name}</p>
                            <p className="mb-2">Address: {companyDetails.address}</p>
                            <p className="mb-2">Category: {companyDetails.category}</p>
                            <p className="mb-2">Email: {companyDetails.email}</p>
                            <p className="mb-2">Phone Number: {companyDetails.phoneNumber}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmployeeProfile;
