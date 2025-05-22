import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function SymptomFrequencyChart({ symptomLogs, size = 'large' }) {
  const symptomCount = {};

  // Count the frequency of each symptom
  symptomLogs.forEach(log => {
    log.symptoms?.forEach(symptom => {
      symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
    });
  });

  // Medically themed color palette (blues, greens, teals, soft reds)
  const medicalColors = [
    '#0077b6', // blue
    '#48cae4', // light blue
    '#90e0ef', // pale blue
    '#00b4d8', // teal
    '#43aa8b', // green
    '#b7e4c7', // mint
    '#f9dcc4', // soft beige
    '#f28482', // soft red
    '#ffb4a2', // peach
    '#adb5bd', // gray
  ];

  // Assign colors from the palette, looping if needed
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(medicalColors[i % medicalColors.length]);
    }
    return colors;
  };

  const symptomLabels = Object.keys(symptomCount);
  const symptomData = Object.values(symptomCount);
  const backgroundColors = generateColors(symptomLabels.length);

  const data = {
    labels: symptomLabels,
    datasets: [
      {
        label: 'Frequency',
        data: symptomData,
        backgroundColor: backgroundColors,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Most Frequent Symptoms Logged',
        color: '#222',
        font: {
          size: 20,
          family: "'Inter', 'Segoe UI', Arial, sans-serif",
          weight: 'bold',
        },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#0077b6',
        bodyColor: '#222',
        borderColor: '#90e0ef',
        borderWidth: 1,
        titleFont: { weight: 'bold' },
        bodyFont: { family: "'Inter', 'Segoe UI', Arial, sans-serif" },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Count', color: '#555', font: { size: 14 } },
        grid: {
          color: '#e9ecef',
          borderDash: [4, 4],
          drawBorder: false,
        },
        ticks: {
          color: '#555',
          font: { family: "'Inter', 'Segoe UI', Arial, sans-serif" },
        },
      },
      y: {
        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#222',
          font: { size: 15, family: "'Inter', 'Segoe UI', Arial, sans-serif" },
          padding: 8,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: '#48cae4',
      },
    },
    animation: {
      duration: 900,
      easing: 'easeOutQuart',
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
      <Bar data={data} options={options} />
    </div>
  );
}
