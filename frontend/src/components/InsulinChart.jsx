import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/InsulinChart.css'; // Import your CSS styles

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InsulinChart = ({ logs }) => {
  // Prepare data for the chart
  const chartData = {
    labels: logs.map((log) => new Date(log.date).toLocaleDateString()), // X-axis labels (dates)
    datasets: [
      {
        label: 'Insulin Levels',
        data: logs.map((log) => log.level), // Y-axis data (insulin levels)
        borderColor: '#0077b6', // Line color
        backgroundColor: 'rgba(0, 119, 182, 0.2)', // Fill under the line
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Insulin Levels Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Insulin Level',
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default InsulinChart;
