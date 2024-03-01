// src/Chart.js

import React from 'react';
import { Line } from 'react-chartjs-2';

const Chart = () => {
    // Sample data for demonstration
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Working Hours',
                data: [8, 7, 8, 7.5, 8, 7.5], // Sample working hours data
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2
            }
        ]
    };

    return (
        <div>
            <h2>Attendance Chart</h2>
            <Line data={data} />
        </div>
    );
};

export default Chart;
