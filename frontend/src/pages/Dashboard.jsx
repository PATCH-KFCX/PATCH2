import React, { useState, useEffect } from 'react';
import SymptomCard from '../components/SymptomCard';
import SymptomModal from '../components/SymptomModal';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [symptomLogs, setSymptomLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/symptoms', {
          credentials: 'include',
        });
        if (response.ok) {
          const logs = await response.json();
          setSymptomLogs(logs);
        } else {
          console.error('Failed to fetch symptom logs:', response.status);
        }
      } catch (err) {
        console.error('Error fetching symptom logs:', err);
      }
    };

    fetchLogs();
  }, []);

  const handleAddLog = (newLog) => {
    if (!newLog?.id) {
      console.error('New log is missing ID:', newLog);
      return;
    }
    setSymptomLogs((prev) => [...prev, newLog]);
  };

  const handleDelete = async (logToDelete) => {
    if (!logToDelete?.id) {
      console.error('Cannot delete log — missing ID:', logToDelete);
      return;
    }

    try {
      const response = await fetch(`/api/symptoms/${logToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setSymptomLogs((prev) =>
          prev.filter((log) => log.id !== logToDelete.id)
        );
      } else {
        console.error('Failed to delete log');
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Symptom Logs Section */}
        <div className="sidebar-card">
          <h2>Symptom Logs & Tracker</h2>
          <ul className="log-list">
            {symptomLogs.slice(-3).map((log) => (
              <li key={log.id}>
                {log.date || 'N/A'} –{' '}
                {Array.isArray(log.symptoms) && log.symptoms.length > 0
                  ? log.symptoms.slice(0, 3).join(', ')
                  : 'No symptoms'}
              </li>
            ))}
          </ul>
          <button
            className="create-log-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Create New Symptom Log
          </button>
        </div>

        {/* Blood Sugar Tracker Section */}
        <div className="sidebar-card">
          <h2>Blood Sugar Tracker</h2>
          <p>Monitor and track your blood sugar levels.</p>
          <button className="tracker-link">Go to Blood Sugar Tracker</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="dashboard-title">Symptom Logs Dashboard</h1>

        {/* Symptom Log Container */}
        <div className="symptom-log-container">
          {symptomLogs.length > 0 ? (
            symptomLogs.map((log) => (
              <SymptomCard
                key={log.id}
                log={log}
                handleDelete={handleDelete}
              />
            ))
          ) : (
            <div className="no-data-message">NO DATA</div>
          )}
        </div>
      </div>

      {/* Modal */}
      <SymptomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLog}
      />
    </div>
  );
}
