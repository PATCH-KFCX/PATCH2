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
        label: 'Insulin Level',
        data: logs.map(log => log.level),
        borderColor: '#43aa8b',
        backgroundColor: 'rgba(67,170,139,0.12)',
        pointBackgroundColor: '#0077b6',
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#48cae4',
        pointHoverBorderColor: '#0077b6',
        tension: 0.35, // smooth curve
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#0077b6',
          font: { size: 14, weight: 'bold', family: 'Inter, Arial, sans-serif' },
        },
      },
      title: {
        display: true,
        text: 'Insulin Over Time',
        color: '#0077b6',
        font: { size: 18, weight: 'bold', family: 'Inter, Arial, sans-serif' },
        padding: { bottom: 18 }
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#43aa8b',
        bodyColor: '#222e3a',
        borderColor: '#90e0ef',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: ctx => `Level: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#0077b6',
          font: { size: 14, weight: 'bold' },
        },
        grid: {
          color: '#eaf6fb',
          borderDash: [2, 4],
        },
        ticks: {
          color: '#222e3a',
          font: { size: 13, family: 'Inter, Arial, sans-serif' },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Insulin Level',
          color: '#0077b6',
          font: { size: 14, weight: 'bold' },
        },
        beginAtZero: true,
        grid: {
          color: '#eaf6fb',
          borderDash: [2, 4],
        },
        ticks: {
          color: '#222e3a',
          font: { size: 13, family: 'Inter, Arial, sans-serif' },
        },
      },
    },
    animation: {
      duration: 900,
      easing: 'easeOutQuart',
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
  };

  const height = size === 'small' ? '250px' : '350px';

  return (
    <div
      style={{
        height,
        background: 'linear-gradient(120deg, #f7fafc 60%, #eaf6fb 100%)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0,119,182,0.07)',
        border: '1px solid #eaf6fb',
        minWidth: 0,
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
}
