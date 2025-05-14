import React, { useState } from 'react';
import '../styles/SymptomModal.css';

export default function SymptomModal({ isOpen, onClose, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    symptoms: [],
    painLocation: [],
    painSeverity: '',
    painType: [],
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the form data
      onSubmit({
        ...formData,
        date: new Date().toLocaleDateString(), // Add the current date
      });

      // Reset the modal and form
      onClose();
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
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Step {currentStep} of 4</h2>
        {currentStep === 1 && (
          <div className="modal-step">
            <label>Select your symptoms today:</label>
            <div className="symptom-options">
              <label>
                <input
                  type="checkbox"
                  name="symptoms"
                  value="Headache"
                  onChange={handleChange}
                />
                Headache
              </label>
              <label>
                <input
                  type="checkbox"
                  name="symptoms"
                  value="Fatigue"
                  onChange={handleChange}
                />
                Fatigue
              </label>
              <label>
                <input
                  type="checkbox"
                  name="symptoms"
                  value="Sneezing"
                  onChange={handleChange}
                />
                Sneezing
              </label>
              <label>
                <input
                  type="checkbox"
                  name="symptoms"
                  value="Mild Cough"
                  onChange={handleChange}
                />
                Mild Cough
              </label>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="modal-step">
            <label>Where is your pain located?</label>
            <div className="pain-location-options">
              <label>
                <input
                  type="checkbox"
                  name="painLocation"
                  value="Head"
                  onChange={handleChange}
                />
                Head
              </label>
              <label>
                <input
                  type="checkbox"
                  name="painLocation"
                  value="Chest"
                  onChange={handleChange}
                />
                Chest
              </label>
              <label>
                <input
                  type="checkbox"
                  name="painLocation"
                  value="Back"
                  onChange={handleChange}
                />
                Back
              </label>
              <label>
                <input
                  type="checkbox"
                  name="painLocation"
                  value="Legs"
                  onChange={handleChange}
                />
                Legs
              </label>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="modal-step">
            <label>How severe is the pain on a scale of 1 to 10?</label>
            <input
              type="range"
              name="painSeverity"
              min="1"
              max="10"
              value={formData.painSeverity}
              onChange={handleChange}
            />
            <p>Selected: {formData.painSeverity || 1}</p>
          </div>
        )}
        {currentStep === 4 && (
          <div className="modal-step">
            <label>What kind of pain are you experiencing?</label>
            <div className="pain-type-options">
              <label>
                <input
                  type="checkbox"
                  name="painType"
                  value="Sharp"
                  onChange={handleChange}
                />
                Sharp
              </label>
              <label>
                <input
                  type="checkbox"
                  name="painType"
                  value="Dull"
                  onChange={handleChange}
                />
                Dull
              </label>
              <label>
                <input
                  type="checkbox"
                  name="painType"
                  value="Throbbing"
                  onChange={handleChange}
                />
                Throbbing
              </label>
              <label>
                <input
                  type="checkbox"
                  name="painType"
                  value="Burning"
                  onChange={handleChange}
                />
                Burning
              </label>
            </div>
          </div>
        )}
        <div className="modal-buttons">
          <button onClick={handleBack} disabled={currentStep === 1}>
            Back
          </button>
          <button onClick={handleNext}>
            {currentStep === 4 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}