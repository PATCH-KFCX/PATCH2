import React from 'react';
import { Link } from 'react-router-dom';
import SymptomCard from '../components/SymptomCard';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const symptomLogs = [1, 2, 3, 4]; // Placeholder entries

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Symptom Logs Dashboard</h1>

      <div className="dashboard-content">
        {/* Left Column with Stacked Sidebars */}
        <div className="sidebar-column">
          {/* Symptom Logs Sidebar */}
          <div className="sidebar">
            <h2>Symptom Logs & Tracker</h2>
            <ul className="log-list">
              <li>Headache, 4/15</li>
              <li>Fatigue, 4/16</li>
              <li>Back Pain, 4/17</li>
            </ul>
            <Link to="/symptom-log" className="create-log-btn">
              Create New Symptom Log
            </Link>
          </div>

          {/* Diabetes Tracker Sidebar */}
          <div className="sidebar">
            <h2>Diabetes Tracker</h2>
            <ul className="log-list">
              <li>Blood Sugar: 120 mg/dL, 4/15</li>
              <li>Blood Sugar: 140 mg/dL, 4/16</li>
              <li>Blood Sugar: 110 mg/dL, 4/17</li>
            </ul>
            <Link to="/diabetes-tracker" className="create-log-btn">
              Go to Diabetes Tracker
            </Link>
          </div>
        </div>

        {/* Symptom Cards Section */}
        <div className="symptom-cards">
          {symptomLogs.map((_, i) => (
            <SymptomCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
