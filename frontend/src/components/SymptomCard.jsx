import React from 'react';
import '../styles/SymptomCard.css';

export default function SymptomCard({ log, handleDelete }) {
  return (
    <div className="symptom-card">
      <h3>Symptom Log</h3>
      <p><strong>Date:</strong> {log.date || 'N/A'}</p>
      <p>
        <strong>Symptoms:</strong>{' '}
        {Array.isArray(log.symptoms) && log.symptoms.length > 0
          ? log.symptoms.join(', ')
          : 'None'}
      </p>
      <p>
        <strong>Pain Location:</strong>{' '}
        {Array.isArray(log.painLocation) && log.painLocation.length > 0
          ? log.painLocation.join(', ')
          : 'None'}
      </p>
      <p>
        <strong>Pain Severity:</strong> {log.painSeverity || 'N/A'}
      </p>
      <p>
        <strong>Pain Type:</strong>{' '}
        {Array.isArray(log.painType) && log.painType.length > 0
          ? log.painType.join(', ')
          : 'None'}
      </p>
      <button
        className="delete-log-btn"
        onClick={() => handleDelete(log)}
      >
        Delete
      </button>
    </div>
  );
}
