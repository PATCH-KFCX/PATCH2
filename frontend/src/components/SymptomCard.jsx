import React, { useState } from 'react';
import '../styles/SymptomCard.css';

const formatDateTime = (rawDate) => {
  if (!rawDate) return 'N/A';
  const date = new Date(rawDate);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function SymptomCard({ log, handleDelete }) {
  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => setShowDetails((prev) => !prev);

  return (
    <div className="symptom-card">
      <div className="card-header">
        <h3>Symptom Log</h3>
        <span className="log-date">{formatDateTime(log.date)}</span>
      </div>

      <div className="card-section">
        <strong>Symptoms:</strong>
        <span>
          {Array.isArray(log.symptoms) && log.symptoms.length > 0
            ? log.symptoms.slice(0, 3).join(', ')
            : 'No symptoms recorded'}
        </span>
      </div>

      {showDetails && (
        <>
          <div className="card-section">
            <strong>All Symptoms:</strong>
            <ul>
              {log.symptoms.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="card-section">
            <strong>Pain Type:</strong>
            <ul>
              {log.painType?.length > 0
                ? log.painType.map((type, i) => <li key={i}>{type}</li>)
                : <li>None selected</li>}
            </ul>
          </div>
          <div className="card-section">
            <strong>Pain Location:</strong>
            <ul>
              {log.painLocation?.length > 0
                ? log.painLocation.map((loc, i) => <li key={i}>{loc}</li>)
                : <li>None selected</li>}
            </ul>
          </div>
          <div className="card-section">
            <strong>Pain Level:</strong> {log.painLevel || 'N/A'}
          </div>
        </>
      )}

      <div className="card-actions">
        <button onClick={toggleDetails}>
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
        <button className="delete-btn" onClick={() => handleDelete(log)}>
          Delete
        </button>
      </div>
    </div>
  );
}
