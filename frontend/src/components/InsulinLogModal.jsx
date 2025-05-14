import React, { useState } from 'react';
import '../styles/InsulinLogModal.css'; // Import your CSS styles

const InsulinLogModal = ({ onClose }) => {
  const [insulinLevel, setInsulinLevel] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/insulin-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          level: insulinLevel,
          date: new Date().toISOString(),
          notes,
        }),
      });

      if (response.ok) {
        onClose();
      } else {
        const data = await response.json();
        alert(data.message || 'Error saving log');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>What is your insulin level?</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={insulinLevel}
            onChange={(e) => setInsulinLevel(e.target.value)}
            placeholder="Insulin Level"
            required
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
          />
          <div className="modal-buttons">
            <button type="submit">Submit</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsulinLogModal;
