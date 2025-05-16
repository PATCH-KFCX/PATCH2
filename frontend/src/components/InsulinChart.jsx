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
import '../styles/InsulinChart.css';

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
  const chartData = {
    labels: logs.map((log) => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Insulin Levels',
        data: logs.map((log) => log.level),
        borderColor: '#0077b6',
        backgroundColor: 'rgba(0, 119, 182, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // allow full height/width
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Insulin Levels Over Time' },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Insulin Level' }, beginAtZero: true },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default InsulinChart;
