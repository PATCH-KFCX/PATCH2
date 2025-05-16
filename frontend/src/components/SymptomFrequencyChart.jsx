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

export default function SymptomFrequencyChart({ symptomLogs }) {
  const symptomCount = {};

  symptomLogs.forEach(log => {
    log.symptoms?.forEach(symptom => {
      symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
    });
  });

  const data = {
    labels: Object.keys(symptomCount),
    datasets: [
      {
        label: 'Frequency',
        data: Object.values(symptomCount),
        backgroundColor: '#1abc9c',
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

  return (
    <div style={{ height: '300px', background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
