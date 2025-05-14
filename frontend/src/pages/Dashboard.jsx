import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import SymptomCard from '../components/SymptomCard';
import SymptomModal from '../components/SymptomModal';
import '../styles/Dashboard.css'; // Import your CSS styles

export default function Dashboard() {
  const { currentUser } = useContext(CurrentUserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [symptomLogs, setSymptomLogs] = useState([]);


  const handleAddLog = (newLog) => {
    setSymptomLogs([...symptomLogs, newLog]);

  };

  const handleDelete = (logToDelete) => {
    setSymptomLogs(symptomLogs.filter((log) => log !== logToDelete));
  };


  // Get the 3 most recent symptom logs
  const recentLogs = symptomLogs.slice(-3).reverse();


  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Symptom Logs Dashboard</h1>

      <div className="dashboard-content">


        <div className="sidebar-column">
          <div className="sidebar">
            <h2>Symptom Logs & Tracker</h2>
            <ul className="log-list">

              {recentLogs.length > 0 ? (
                recentLogs.map((log, index) => (
                  <li key={index}>
                    {log.date || 'N/A'} -{' '}
                    {Array.isArray(log.symptoms) && log.symptoms.length > 0
                      ? log.symptoms.slice(0, 3).join(', ')
                      : 'No symptoms'}
                  </li>
                ))
              ) : (
                <li>No recent logs available</li>
              )}

            </ul>
            <button className="create-log-btn" onClick={() => setIsModalOpen(true)}>
              Create New Symptom Log
            </button>
          </div>

          <div className="sidebar">
            <h2>Blood Sugar Tracker</h2>
            <p>Monitor and track your blood sugar levels.</p>
            <Link to="/blood-sugar-tracker" className="tracker-link">
              Go to Blood Sugar Tracker
            </Link>
          </div>
        </div>

        <div className="symptom-cards">
          {symptomLogs.map((log, index) => (
            <SymptomCard key={index} log={log} handleDelete={handleDelete} />
          ))}
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