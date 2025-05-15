import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

      <div className="dashboard-body">
        {/* Symptom Logs Section */}
        <div className="dashboard-column">
          <h2>Symptom Logs</h2>
          <Link to="/dashboard" className="create-log-btn">Go to Symptom Dashboard</Link>
          <div className="symptom-log-container">
            {symptomLogs.length > 0 ? (
              symptomLogs.map(log => (
                <SymptomCard key={log.id} log={log} />
              ))
            ) : (
              <div className="no-data-message">No symptom logs available</div>
            )}
          </div>
        </div>

        {/* Insulin Logs Section */}
        <div className="dashboard-column">
          <h2>Insulin Logs</h2>
          <Link to="/blood-sugar-tracker" className="create-log-btn">Go to Blood Sugar Tracker</Link>
          <button onClick={downloadCSV} className="export-button">Export Logs</button>
          <div className="symptom-log-container">
            {insulinLogs.length > 0 ? (
              insulinLogs.map(log => (
                <DiabetesCards key={log.id} log={log} />
              ))
            ) : (
              <div className="no-data-message">No insulin logs available</div>
            )}
          </div>
        </div>
      </div>

      <div className="chart-section">
        <InsulinChart logs={insulinLogs} />
      </div>

      {showSymptomModal && (
        <SymptomModal
          isOpen={true}
          onClose={() => setShowSymptomModal(false)}
          onSubmit={(newLog) => setSymptomLogs([...symptomLogs, newLog])}
        />
      )}

      {showInsulinModal && (
        <InsulinLogModal
          onClose={() => {
            setShowInsulinModal(false);
            fetch('/api/diabetes-logs', { credentials: 'include' })
              .then(res => res.json())
              .then(setInsulinLogs);
          }}
        />
      )}
    </div>
  );
}
