// HealthDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import SymptomCard from '../components/SymptomCard';
import DiabetesCards from '../components/DiabetesCards';
import InsulinChart from '../components/InsulinChart';
import SymptomModal from '../components/SymptomModal';
import InsulinLogModal from '../components/InsulinLogModal';
import UserContext from '../contexts/current-user-context';
import '../styles/HealthDashboard.css';

export default function HealthDashboard() {
  const [symptomLogs, setSymptomLogs] = useState([]);
  const [insulinLogs, setInsulinLogs] = useState([]);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [showInsulinModal, setShowInsulinModal] = useState(false);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchSymptoms = async () => {
      const res = await fetch('/api/symptoms', { credentials: 'include' });
      const data = await res.json();
      setSymptomLogs(data);
    };

    const fetchInsulin = async () => {
      const res = await fetch('/api/diabetes-logs', { credentials: 'include' });
      const data = await res.json();
      setInsulinLogs(data);
    };

    fetchSymptoms();
    fetchInsulin();
  }, []);

  const downloadCSV = () => {
    const headers = ['Date', 'Insulin Level', 'Notes'];
    const rows = insulinLogs.map(log => [log.date, log.level, `"${log.notes || ''}"`]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'insulin_logs.csv';
    a.click();
  };

  return (
    <div className="health-dashboard">
      <header className="dashboard-header">
        <h1>Health Dashboard</h1>
        <button onClick={() => document.body.classList.toggle('dark-mode')}>🌓 Toggle Theme</button>
      </header>

      <div className="dashboard-section">
        <div className="card-column">
          <h2>Symptom Logs</h2>
          {/* Updated Button */}
          <Link to="/dashboard" className="button">
            Go To Symptom Dashboard
          </Link>
          <div className="scrollable">
            {symptomLogs.map(log => (
              <SymptomCard key={log.id} log={log} />
            ))}
          </div>
        </div>

        <div className="card-column">
          <h2>Insulin Logs</h2>
          <button onClick={() => setShowInsulinModal(true)}>+ Add Insulin Log</button>
          <button className="export-button" onClick={downloadCSV}>Export Logs</button>
          <div className="scrollable">
            {insulinLogs.map(log => (
              <DiabetesCards key={log.id} log={log} />
            ))}
          </div>
        </div>
      </div>

      <div className="chart-section">
        <InsulinChart logs={insulinLogs} />
      </div>

      {showSymptomModal && (
        <SymptomModal isOpen={true} onClose={() => setShowSymptomModal(false)} onSubmit={(newLog) => setSymptomLogs([...symptomLogs, newLog])} />
      )}

      {showInsulinModal && (
        <InsulinLogModal onClose={() => {
          setShowInsulinModal(false);
          fetch('/api/diabetes-logs', { credentials: 'include' })
            .then(res => res.json())
            .then(setInsulinLogs);
        }} />
      )}
    </div>
  );
}
