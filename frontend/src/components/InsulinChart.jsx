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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function InsulinChart({ logs, size = 'large' }) {
  const data = {
    labels: logs.map(log => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Insulin Levels',
        data: logs.map(log => log.level),
        borderColor: '#0077b6',
        backgroundColor: 'rgba(0, 119, 182, 0.2)',
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Insulin Over Time' },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Level' }, beginAtZero: true },
    },
  };

const height = size === 'small' ? '250px' : '350px';

  return (
    <div
      style={{
        height,
        background: '#fff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
}
