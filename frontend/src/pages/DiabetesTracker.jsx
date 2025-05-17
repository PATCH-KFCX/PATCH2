import React, { useState, useEffect } from 'react';
import DiabetesCards from '../components/DiabetesCards';
import InsulinChart from '../components/InsulinChart';
import InsulinLogModal from '../components/InsulinLogModal';
import '../styles/DiabetesTracker.css';

const DiabetesTracker = () => {
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch('/api/diabetes-logs', { credentials: 'include' });
      const data = await res.json();
      setLogs(data);
    };
    fetchLogs();
  }, []);

  const handleDeleteInsulinLog = async (logToDelete) => {
    if (!logToDelete?.id) return;
    try {
      const response = await fetch(`/api/diabetes-logs/${logToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setLogs((prev) => prev.filter((log) => log.id !== logToDelete.id));
      }
    } catch (err) {
      console.error('Error deleting insulin log:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-card">
          <h2>Blood Sugar Logs</h2>
          <p>View and track your daily blood sugar levels.</p>
          <button className="create-log-btn" onClick={() => setShowModal(true)}>
            + Add Blood Sugar Log
          </button>
        </div>
        <div className="sidebar-card">
          <h2>Symptom Tracker</h2>
          <p>Monitor your symptoms and pain history.</p>
          <a href="/dashboard" className="sidebar-button">
            Go to Symptom Tracker
          </a>
        </div>
      </div>

      <div className="main-content">
        <h1 className="dashboard-title">Blood Sugar Tracker</h1>

        <div className="diabetes-log-container">
          {logs.length > 0 ? (
            logs.map((log) => (
              <DiabetesCards key={log.id} log={log} handleDelete={handleDeleteInsulinLog} />
            ))
          ) : (
            <div className="no-data-message">NO DATA</div>
          )}
        </div>

        <div className="wide-chart-container">
          <InsulinChart logs={logs} size="large" />
        </div>
      </div>

      {showModal && (
        <InsulinLogModal
          onClose={() => {
            setShowModal(false);
            fetch('/api/diabetes-logs', { credentials: 'include' })
              .then((res) => res.json())
              .then(setLogs);
          }}
          onSubmit={(newLog) => setLogs((prev) => [...prev, newLog])}
        />
      )}
    </div>
  );
};

export default DiabetesTracker;
