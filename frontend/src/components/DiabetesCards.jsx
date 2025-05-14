import React from 'react';
import '../styles/DiabetesCards.css'; // Import your CSS styles

const DiabetesCards = ({ log }) => {
  const { date, level, notes } = log;

  return (
    <div className="diabetes-card">
      <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
      <p><strong>Insulin Level:</strong> {level}</p>
      {notes && <p><strong>Notes:</strong> {notes}</p>}
    </div>
  );
};

export default DiabetesCards;
