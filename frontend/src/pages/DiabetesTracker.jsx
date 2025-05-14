import React, { useState, useEffect } from 'react';
import '../styles/DiabetesTracker.css'; // Import your CSS styles
import DiabetesCards from '../components/DiabetesCards';
import InsulinChart from '../components/InsulinChart';
import InsulinLogModal from '../components/InsulinLogModal';

const DiabetesTracker = () => {
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/insulin-logs', { credentials: 'include' });
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch insulin logs:', err);
      }
    };

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
              logs.map((log) => <DiabetesCards key={log.id} log={log} />)
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

      {showModal && <InsulinLogModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default DiabetesTracker;
