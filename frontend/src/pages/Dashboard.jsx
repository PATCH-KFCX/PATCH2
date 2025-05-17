import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SymptomCard from '../components/SymptomCard';
import SymptomModal from '../components/SymptomModal';
import SymptomFrequencyChart from '../components/SymptomFrequencyChart';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [symptomLogs, setSymptomLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/symptoms', { credentials: 'include' });
        const logs = await response.json();
        setSymptomLogs(logs);
      } catch (err) {
        console.error('Error fetching symptom logs:', err);
      }
    };
    fetchLogs();
  }, []);

  const handleAddLog = (newLog) => setSymptomLogs((prev) => [...prev, newLog]);

  const handleDelete = async (logToDelete) => {
    if (!logToDelete?.id) return;
    try {
      const response = await fetch(`/api/symptoms/${logToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setSymptomLogs((prev) => prev.filter((log) => log.id !== logToDelete.id));
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-card">
          <h2>Symptom Logs & Tracker</h2>
          <ul className="log-list">
            {symptomLogs.slice(-3).map((log) => {
              const formattedDate = new Date(log.date).toLocaleDateString();
              const symptoms = Array.isArray(log.symptoms)
                ? log.symptoms.slice(0, 3).join(', ')
                : 'No symptoms';
              return <li key={log.id}><strong>{formattedDate}</strong> – {symptoms}</li>;
            })}
          </ul>
          <button className="create-log-btn" onClick={() => setIsModalOpen(true)}>
            + Add Symptom Log
          </button>
        </div>

        <div className="sidebar-card">
          <h2>Blood Sugar Tracker</h2>
          <p>Monitor and track your blood sugar levels.</p>
          <button className="sidebar-button" onClick={() => navigate('/blood-sugar-tracker')}>
            Go to Blood Sugar Tracker
          </button>
        </div>
      </div>

      <div className="main-content">
        <h1 className="dashboard-title">Symptom Logs Dashboard</h1>
        <div className="symptom-log-container">
          {symptomLogs.length > 0 ? (
            symptomLogs.map((log) => (
              <SymptomCard key={log.id} log={log} handleDelete={handleDelete} />
            ))
          ) : (
            <div className="no-data-message">NO DATA</div>
          )}
        </div>
        <div className="wide-chart-container">
          <SymptomFrequencyChart symptomLogs={symptomLogs} />
        </div>
      </div>

      <SymptomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLog}
      />
    </div>
  );
}
