import React from 'react';
import '../styles/MedicationCard.css';

export default function MedicationCard({ medication, onDelete }) {
  return (
    <div className="medication-item">
      <p>
        <strong>{medication.name}</strong> - {medication.dosage} {medication.unit} ({medication.frequency})
      </p>
      <button onClick={() => onDelete(medication.id)}>Delete</button>
    </div>
  );
}