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

  // Generate a unique color for each symptom
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137.5) % 360; // Spread colors evenly across the hue spectrum
      colors.push(`hsl(${hue}, 70%, 60%)`); // HSL color format
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
        backgroundColor: backgroundColors, // Assign unique colors to each bar
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
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Count' },
      },
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
