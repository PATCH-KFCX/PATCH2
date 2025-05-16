import React, { useState, useContext } from 'react';
import '../styles/InsulinLogModal.css';
import UserContext from '../contexts/current-user-context';

export default function InsulinLogModal({ onClose, onSubmit }) {
  const [insulinLevel, setInsulinLevel] = useState('');
  const [notes, setNotes] = useState('');
  const { currentUser } = useContext(UserContext);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/diabetes-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: currentUser.id,
          date: new Date().toISOString(),
          level: insulinLevel,
          notes: notes.slice(0, 20),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit insulin log');

      const data = await response.json();
      if (onSubmit) await onSubmit(data);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error submitting insulin log:', error);
    }
  };

  return (
    <div className="insulin-modal-overlay">
      <div className="insulin-modal">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Add Insulin Log</h2>
        <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="form-group">
            <label htmlFor="insulin-level">Insulin Level</label>
            <input
              id="insulin-level"
              type="number"
              value={insulinLevel}
              onChange={(e) => setInsulinLevel(e.target.value)}
              placeholder="Enter your insulin level"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="insulin-notes">Notes</label>
            <textarea
              id="insulin-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes (max 20 chars)"
              maxLength={20}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
