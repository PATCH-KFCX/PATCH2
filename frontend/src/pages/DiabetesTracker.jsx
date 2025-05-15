import React, { useState, useEffect } from 'react';
import '../styles/DiabetesTracker.css';
import DiabetesCards from '../components/DiabetesCards';
import InsulinChart from '../components/InsulinChart';
import InsulinLogModal from '../components/InsulinLogModal';

const DiabetesTracker = () => {
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/diabetes-logs', { credentials: 'include' });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch insulin logs:', err);
    }
  };

  const handleDelete = async (logId) => {
    try {
      const res = await fetch(`/api/diabetes-logs/${logId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        // Remove the log from the state
        setLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId));
      } else {
        console.error('Failed to delete log');
      }
    } catch (err) {
      console.error('Error deleting log:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="tracker-wrapper">
      <h1 className="tracker-title">Diabetes Tracker</h1>
      <div className="tracker-content">
        <div className="card-section">
          <h2 className="section-heading">Recent Insulin Levels</h2>
          <div className="card-list">
            {logs.length > 0 ? (
              logs.map((log) => (
                <DiabetesCards key={log.id} log={log} handleDelete={handleDelete} />
              ))
            ) : (
              <p className="no-data">No insulin logs available</p>
            )}
          </div>
          <button className="green-button" onClick={() => setShowModal(true)}>
            Create New Insulin Log
          </button>
        </div>
        <div className="chart-section">
          <InsulinChart logs={logs} />
        </div>
      </div>
      {showModal && (
        <InsulinLogModal onClose={() => {
          setShowModal(false);
          fetchLogs(); // Refresh data after modal closes
        }} />
      )}
    </div>
  );
};

export default DiabetesTracker;
