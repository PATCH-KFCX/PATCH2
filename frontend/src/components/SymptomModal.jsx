import React, { useState } from 'react';
import '../styles/SymptomModal.css';

const today = new Date().toISOString().split('T')[0];

const SYMPTOMS = ['Headache', 'Fatigue', 'Nausea', 'Fever', 'Cough'];
const PAIN_TYPES = ['Sharp', 'Dull', 'Throbbing', 'Stabbing'];
const PAIN_LOCATIONS = ['Head', 'Back', 'Stomach', 'Chest'];

export default function SymptomModal({ isOpen, onClose, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    date: today,
    symptoms: [],
    painType: [],
    painLocation: [],
    painLevel: 5,
  });

  const handleCheckboxChange = (group, value) => {
    setFormData((prev) => {
      const current = prev[group];
      return {
        ...prev,
        [group]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleSliderChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      painLevel: parseInt(e.target.value),
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
  try {
    const response = await fetch('/api/symptoms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const newLog = await response.json();

      console.log('✔ New log from backend:', newLog);
      if (!newLog?.id) {
        console.error('Missing log ID');
        return;
      }

      onSubmit(newLog);
      onClose();
      setCurrentStep(1);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        symptoms: [],
        painType: [],
        painLocation: [],
        painLevel: 5,
      });
    }
  } catch (err) {
    console.error('Error saving log:', err);
  }
};

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <div className="progress-bar">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step ${currentStep === 3 ? 'active' : ''}`}>3</div>
        </div>

        <form className="symptom-form" onSubmit={(e) => e.preventDefault()}>
          {currentStep === 1 && (
            <>
              <h2>Select Symptoms</h2>
              <div className="checkbox-group">
                {SYMPTOMS.map((symptom, i) => (
                  <React.Fragment key={symptom}>
                    <input
                      type="checkbox"
                      id={`symptom-${i}`}
                      checked={formData.symptoms.includes(symptom)}
                      onChange={() => handleCheckboxChange('symptoms', symptom)}
                    />
                    <label htmlFor={`symptom-${i}`}>{symptom}</label>
                  </React.Fragment>
                ))}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2>Pain Details</h2>
              <h4>Pain Types</h4>
              <div className="checkbox-group">
                {PAIN_TYPES.map((type, i) => (
                  <React.Fragment key={type}>
                    <input
                      type="checkbox"
                      id={`painType-${i}`}
                      checked={formData.painType.includes(type)}
                      onChange={() => handleCheckboxChange('painType', type)}
                    />
                    <label htmlFor={`painType-${i}`}>{type}</label>
                  </React.Fragment>
                ))}
              </div>

              <h4>Pain Locations</h4>
              <div className="checkbox-group">
                {PAIN_LOCATIONS.map((loc, i) => (
                  <React.Fragment key={loc}>
                    <input
                      type="checkbox"
                      id={`painLocation-${i}`}
                      checked={formData.painLocation.includes(loc)}
                      onChange={() => handleCheckboxChange('painLocation', loc)}
                    />
                    <label htmlFor={`painLocation-${i}`}>{loc}</label>
                  </React.Fragment>
                ))}
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h2>Pain Level</h2>
              <div className="slider-group">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.painLevel}
                  onChange={handleSliderChange}
                />
                <span className="slider-value">{formData.painLevel}</span>
              </div>
              <p className="summary-note">Date: {formData.date}</p>
            </>
          )}

          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" onClick={handleBack}>Back</button>
            )}
            {currentStep < 3 ? (
              <button type="button" onClick={handleNext}>Next</button>
            ) : (
              <button type="button" className="submit-btn" onClick={handleSubmit}>
                Submit Log
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
