import React from 'react';
import '../styles/DiabetesCards.css'; // Import your CSS styles

const DiabetesCards = ({ log, handleDelete }) => {
  return (
    <div className="diabetes-card">
      <p><strong>Date:</strong> {new Date(log.date).toLocaleDateString()}</p>
      <p><strong>Level:</strong> {log.level}</p>
      <p><strong>Notes:</strong> {log.notes || 'No notes'}</p>
      <button
        className="delete-button"
        onClick={() => handleDelete(log.id)}
      >
        Delete
      </button>
    </div>
  );
};

export default DiabetesCards;
