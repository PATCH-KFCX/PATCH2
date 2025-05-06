import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SymptomCard from '../components/SymptomCard';
import '../styles/Dashboard.css';

export default function Dashboard() {
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

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Add the form data to the symptom logs with the current date
      const newLog = {
        ...formData,
        date: new Date().toLocaleDateString(), // Add the current date
      };
      setSymptomLogs([...symptomLogs, newLog]);

      // Reset the modal and form
      setIsModalOpen(false);
      setCurrentStep(1);
      setFormData({
        symptoms: [],
        painLocation: [],
        painSeverity: '',
        painType: [],
        doctor: [],
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevFormData) => {
        const updatedField = Array.isArray(prevFormData[name])
          ? [...prevFormData[name]]
          : [];

        if (checked) {
          updatedField.push(value); // Add the selected value
        } else {
          const index = updatedField.indexOf(value);
          if (index > -1) updatedField.splice(index, 1); // Remove the unselected value
        }

        return { ...prevFormData, [name]: updatedField };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDelete = (logToDelete) => {
    setSymptomLogs(symptomLogs.filter((log) => log !== logToDelete));
  };

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
            <button
              className="create-log-btn"
              onClick={() => setIsModalOpen(true)}
            >
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

        {/* Symptom Cards Section */}
        <div className="symptom-cards">
          {symptomLogs.map((log, index) => (
            <SymptomCard key={index} log={log} handleDelete={handleDelete} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Step {currentStep} of 5</h2>
            {currentStep === 1 && (
              <div className="modal-step medical-theme">
                <label className="modal-label">Select your symptoms today:</label>
                <div className="symptom-options">
                  <h4 className="symptom-category mild">Mild Symptoms</h4>
                  <div className="symptom-list">
                    <label className="symptom-item">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value="Headache"
                        onChange={handleChange}
                      />
                      Headache
                    </label>
                    <label className="symptom-item">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value="Fatigue"
                        onChange={handleChange}
                      />
                      Fatigue
                    </label>
                    <label className="symptom-item">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value="Sneezing"
                        onChange={handleChange}
                      />
                      Sneezing
                    </label>
                    <label className="symptom-item">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value="Mild Cough"
                        onChange={handleChange}
                      />
                      Mild Cough
                    </label>
                  </div>

                  <h4 className="symptom-category moderate">Moderate Symptoms</h4>
                  <div className="symptom-list">
                    <label className="symptom-item">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value="Nausea"
                        onChange={handleChange}
                      />
                      Nausea
                    </label>
                    <label className="symptom-item">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value="Dizziness"
                        onChange={handleChange}
                      />
                      Dizziness
                    </label>
                    <label className="symptom-item">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value="Fever"
                        onChange={handleChange}
                      />
                      Fever
                    </label>
                    <label className="symptom-item">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value="Body Aches"
                        onChange={handleChange}
                      />
                      Body Aches
                    </label>
                  </div>

                  <h4 className="symptom-category severe">Severe Symptoms</h4>
                  <div className="symptom-list">
                    <label className="symptom-item">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value="Chest Pain"
                        onChange={handleChange}
                      />
                      Chest Pain
                    </label>
                    <label className="symptom-item">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value="Shortness of Breath"
                        onChange={handleChange}
                      />
                      Shortness of Breath
                    </label>
                    <label className="symptom-item">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value="Severe Abdominal Pain"
                        onChange={handleChange}
                      />
                      Severe Abdominal Pain
                    </label>
                    <label className="symptom-item">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value="Loss of Consciousness"
                        onChange={handleChange}
                      />
                      Loss of Consciousness
                    </label>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="modal-step medical-theme">
                <label className="modal-label">Where is your pain located?</label>
                <div className="pain-location-options">
                  <h4 className="pain-category extremities">Extremities</h4>
                  <div className="pain-list">
                    <label className="pain-item">
                      <input
                        type="checkbox"
                        name="painLocation"
                        value="Hands"
                        onChange={handleChange}
                      />
                      Hands
                    </label>
                    <label className="pain-item">
                      <input
                        type="checkbox"
                        name="painLocation"
                        value="Feet"
                        onChange={handleChange}
                      />
                      Feet
                    </label>
                    <label className="pain-item">
                      <input
                        type="checkbox"
                        name="painLocation"
                        value="Arms"
                        onChange={handleChange}
                      />
                      Arms
                    </label>
                    <label className="pain-item">
                      <input
                        type="checkbox"
                        name="painLocation"
                        value="Legs"
                        onChange={handleChange}
                      />
                      Legs
                    </label>
                  </div>

                  <h4 className="pain-category torso">Torso</h4>
                  <div className="pain-list">
                    <label className="pain-item">
                      <input
                        type="checkbox"
                        name="painLocation"
                        value="Chest"
                        onChange={handleChange}
                      />
                      Chest
                    </label>
                    <label className="pain-item">
                      <input
                        type="checkbox"
                        name="painLocation"
                        value="Abdomen"
                        onChange={handleChange}
                      />
                      Abdomen
                    </label>
                    <label className="pain-item">
                      <input
                        type="checkbox"
                        name="painLocation"
                        value="Back"
                        onChange={handleChange}
                      />
                      Back
                    </label>
                    <label className="pain-item">
                      <input
                        type="checkbox"
                        name="painLocation"
                        value="Pelvis"
                        onChange={handleChange}
                      />
                      Pelvis
                    </label>
                  </div>

                  <h4 className="pain-category head-neck">Head/Neck</h4>
                  <div className="pain-list">
                    <label className="pain-item">
                      <input
                        type="checkbox"
                        name="painLocation"
                        value="Head"
                        onChange={handleChange}
                      />
                      Head
                    </label>
                    <label className="pain-item">
                      <input
                        type="checkbox"
                        name="painLocation"
                        value="Neck"
                        onChange={handleChange}
                      />
                      Neck
                    </label>
                    <label className="pain-item">
                      <input
                        type="checkbox"
                        name="painLocation"
                        value="Jaw"
                        onChange={handleChange}
                      />
                      Jaw
                    </label>
                    <label className="pain-item">
                      <input
                        type="checkbox"
                        name="painLocation"
                        value="Face"
                        onChange={handleChange}
                      />
                      Face
                    </label>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="modal-step medical-theme">
                <label className="modal-label">How severe is the pain on a scale of 1 to 10?</label>
                <div className="slider-container">
                  <input
                    type="range"
                    name="painSeverity"
                    min="1"
                    max="10"
                    value={formData.painSeverity}
                    onChange={handleChange}
                    className="slider"
                  />
                  <div className="slider-labels">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                  <div className="slider-value">Selected: {formData.painSeverity || 1}</div>
                </div>
              </div>
            )}
            {currentStep === 4 && (
              <div className="modal-step medical-theme">
                <label className="modal-label">What kind of pain are you experiencing?</label>
                <div className="pain-type-options">
                  <div className="pain-type-list">
                    <label className="pain-type-item">
                      <input
                        type="checkbox"
                        name="painType"
                        value="Sharp"
                        onChange={handleChange}
                      />
                      Sharp
                    </label>
                    <label className="pain-type-item">
                      <input
                        type="checkbox"
                        name="painType"
                        value="Dull"
                        onChange={handleChange}
                      />
                      Dull
                    </label>
                    <label className="pain-type-item">
                      <input
                        type="checkbox"
                        name="painType"
                        value="Throbbing"
                        onChange={handleChange}
                      />
                      Throbbing
                    </label>
                    <label className="pain-type-item">
                      <input
                        type="checkbox"
                        name="painType"
                        value="Burning"
                        onChange={handleChange}
                      />
                      Burning
                    </label>
                    <label className="pain-type-item">
                      <input
                        type="checkbox"
                        name="painType"
                        value="Stabbing"
                        onChange={handleChange}
                      />
                      Stabbing
                    </label>
                    <label className="pain-type-item">
                      <input
                        type="checkbox"
                        name="painType"
                        value="Cramping"
                        onChange={handleChange}
                      />
                      Cramping
                    </label>
                    <label className="pain-type-item">
                      <input
                        type="checkbox"
                        name="painType"
                        value="Radiating"
                        onChange={handleChange}
                      />
                      Radiating
                    </label>
                    <label className="pain-type-item">
                      <input
                        type="checkbox"
                        name="painType"
                        value="Tingling"
                        onChange={handleChange}
                      />
                      Tingling
                    </label>
                    <label className="pain-type-item">
                      <input
                        type="checkbox"
                        name="painType"
                        value="Pressure"
                        onChange={handleChange}
                      />
                      Pressure
                    </label>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 5 && (
              <div className="modal-step medical-theme">
                <label className="modal-label">Which type of doctor would you like to visit?</label>
                <div className="doctor-type-options">
                  <div className="doctor-type-list">
                    <label className="doctor-type-item">
                      <input
                        type="checkbox"
                        name="doctorType"
                        value="General Practitioner"
                        onChange={handleChange}
                      />
                      General Practitioner
                    </label>
                    <label className="doctor-type-item">
                      <input
                        type="checkbox"
                        name="doctorType"
                        value="Pediatrician"
                        onChange={handleChange}
                      />
                      Pediatrician
                    </label>
                    <label className="doctor-type-item">
                      <input
                        type="checkbox"
                        name="doctorType"
                        value="Cardiologist"
                        onChange={handleChange}
                      />
                      Cardiologist
                    </label>
                    <label className="doctor-type-item">
                      <input
                        type="checkbox"
                        name="doctorType"
                        value="Dermatologist"
                        onChange={handleChange}
                      />
                      Dermatologist
                    </label>
                    <label className="doctor-type-item">
                      <input
                        type="checkbox"
                        name="doctorType"
                        value="Orthopedist"
                        onChange={handleChange}
                      />
                      Orthopedist
                    </label>
                    <label className="doctor-type-item">
                      <input
                        type="checkbox"
                        name="doctorType"
                        value="Neurologist"
                        onChange={handleChange}
                      />
                      Neurologist
                    </label>
                    <label className="doctor-type-item">
                      <input
                        type="checkbox"
                        name="doctorType"
                        value="Psychiatrist"
                        onChange={handleChange}
                      />
                      Psychiatrist
                    </label>
                    <label className="doctor-type-item">
                      <input
                        type="checkbox"
                        name="doctorType"
                        value="Gynecologist"
                        onChange={handleChange}
                      />
                      Gynecologist
                    </label>
                    <label className="doctor-type-item">
                      <input
                        type="checkbox"
                        name="doctorType"
                        value="Oncologist"
                        onChange={handleChange}
                      />
                      Oncologist
                    </label>
                    <label className="doctor-type-item">
                      <input
                        type="checkbox"
                        name="doctorType"
                        value="Endocrinologist"
                        onChange={handleChange}
                      />
                      Endocrinologist
                    </label>
                  </div>
                </div>
              </div>
            )}
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
