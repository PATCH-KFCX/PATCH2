import React from 'react';
import '../styles/SymptomCard.css';

export default function SymptomCard({ log, handleDelete }) {
  return (
    <div className="symptom-card">
      <h3>Symptom Log</h3>
      <p><strong>Date:</strong> {log.date}</p>
      <p><strong>Symptoms:</strong> {log.symptoms.join(', ')}</p>
      <p><strong>Pain Location:</strong> {log.painLocation.join(', ')}</p>
      <p><strong>Pain Severity:</strong> {log.painSeverity}</p>
      <p><strong>Pain Type:</strong> {log.painType.join(', ')}</p>
      <p><strong>Doctor Type:</strong> {log.doctor.join(', ')}</p>
      <button
        className="delete-log-btn"
        onClick={() => handleDelete(log)}
      >
        Delete
      </button>
    </div>
  );
}
