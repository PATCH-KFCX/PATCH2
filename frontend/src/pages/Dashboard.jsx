import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import SymptomCard from '../components/SymptomCard';
import '../styles/Dashboard.css';
import { fetchHandler, getPostOptions } from '../utils/fetchingUtils';
import CurrentUserContext from '../contexts/current-user-context';

export default function Dashboard() {
  const { currentUser } = useContext(CurrentUserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    symptoms: [],
    painLocation: [],
    painSeverity: '',
    painType: [],
    doctor: [],
  });

  const [symptomLogs, setSymptomLogs] = useState([]);

  // Fetch logs when component mounts
  useEffect(() => {
    const fetchLogs = async () => {
      const [logs, error] = await fetchHandler('/api/symptoms');
      if (!error && logs) {
        setSymptomLogs(logs);
      }
    };
    fetchLogs();
  }, []);

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      const logToSave = {
        date: new Date().toISOString().split('T')[0],
        symptoms: formData.symptoms.join(', '),
        pain_type: formData.painType.join(', '),
        pain_location: formData.painLocation.join(', '),
        pain_level: parseInt(formData.painSeverity),
      };

      const [savedLog, error] = await fetchHandler('/api/symptoms', getPostOptions(logToSave));
      if (!error && savedLog) {
        setSymptomLogs([...symptomLogs, savedLog]);
      }

      // Reset form
      setIsModalOpen(false);
      setCurrentStep(1);
      setFormData({
        symptoms: [],
        painLocation: [],
        painSeverity: '',
        painType: [],
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => {
        const updated = Array.isArray(prev[name]) ? [...prev[name]] : [];
        if (checked) {
          updated.push(value);
        } else {
          const index = updated.indexOf(value);
          if (index > -1) updated.splice(index, 1);
        }
        return { ...prev, [name]: updated };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDelete = (logToDelete) => {
    setSymptomLogs(symptomLogs.filter((log) => log !== logToDelete));
  };

  if (!currentUser) {
    return <p className="dashboard-warning">Please log in to view your dashboard.</p>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Symptom Logs Dashboard</h1>

      <div className="dashboard-content">
        {/* Sidebar Column */}
        <div className="sidebar-column">
          {/* Symptom Logs Sidebar */}
          <div className="sidebar">
            <h2>Symptom Logs & Tracker</h2>
            <ul className="log-list">
              {symptomLogs.slice(0, 3).map((log, i) => (
                <li key={i}>{log.symptoms} - {log.date}</li>
              ))}
            </ul>
            <button className="create-log-btn" onClick={() => setIsModalOpen(true)}>
              Create New Symptom Log
            </button>
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

        {/* Symptom Cards */}
        <div className="symptom-cards">
          {symptomLogs.map((log, index) => (
            <SymptomCard key={index} log={log} handleDelete={handleDelete} />
          ))}
        </div>
      </div>

      {/* Modal rendering is unchanged; your steps 1–5 already look great */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Step {currentStep} of 5</h2>
            {/* ... retain your current step modal logic here exactly as you wrote it ... */}
            {/* I omitted it here for brevity since your modal steps are already correctly implemented */}
            <div className="modal-buttons">
              <button onClick={handleBack} disabled={currentStep === 1}>
                Back
              </button>
              <button onClick={handleNext}>
                {currentStep === 5 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
