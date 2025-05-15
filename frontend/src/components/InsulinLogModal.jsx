import React, { useState, useContext } from 'react';
import '../styles/InsulinLogModal.css';
import UserContext from '../contexts/current-user-context';

const InsulinLogModal = ({ onClose, onSubmit }) => {
  const [insulinLevel, setInsulinLevel] = useState('');
  const [notes, setNotes] = useState('');
  const { currentUser } = useContext(UserContext);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/diabetes-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          notes,
          date: new Date().toISOString(),
          level: insulinLevel,
          userId: currentUser.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit insulin log');
      }

      const data = await response.json();

      if (onSubmit) {
        await onSubmit(data);
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting insulin log:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>What is your insulin level?</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <input
            type="number"
            value={insulinLevel}
            onChange={(e) => setInsulinLevel(e.target.value)}
            placeholder="Insulin Level"
            required
          />
          <textarea
            value={notes}
            onChange={(e) => {
              if (e.target.value.length <= 20) {
                setNotes(e.target.value);
              }
            }}
            maxLength={20}
            placeholder="Optional notes (max 20 characters)"
          />
          <small style={{ fontSize: '0.8rem', color: '#666' }}>
            {20 - notes.length} characters remaining
          </small>
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
