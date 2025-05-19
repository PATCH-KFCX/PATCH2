import React from 'react';
import '../styles/DiabetesCards.css';

export default function DiabetesCards({ log, handleDelete }) {
  const dateObject = new Date(log.date);
  if (isNaN(dateObject.getTime())) return <div className="diabetes-card">Invalid date</div>;

  const formattedDate = dateObject.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = dateObject.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="diabetes-card">
      <h3>{formattedDate}</h3>
      <p><strong>Time:</strong> {formattedTime}</p>
      <p><strong>Insulin Level:</strong> {log.level}</p>
      <p><strong>Notes:</strong> {log.notes || 'No notes'}</p>
      <button className="delete-button" onClick={() => handleDelete(log)}>Delete</button>
    </div>
  );
}
