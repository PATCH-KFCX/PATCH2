import React, { useState, useEffect } from 'react';
import { fetchMedications, addMedication, deleteMedication } from '../adapters/medications-adapter';
import '../styles/MedicationTracker.css';

export default function MedicationTracker() {
  const [medications, setMedications] = useState([]);
  const [form, setForm] = useState({ name: '', dosage: '', days: '' });

  useEffect(() => {
    const loadMedications = async () => {
      try {
        const meds = await fetchMedications();
        console.log('💊 Meds fetched:', meds);
        setMedications(Array.isArray(meds) ? meds : []); // Ensure medications is always an array
      } catch (err) {
        console.error('Error fetching medications:', err);
      }
    };

    loadMedications();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMed = await addMedication(form);
      setMedications((prev) => [...prev, newMed]); // Add the new medication to the state
      setForm({ name: '', dosage: '', days: '' }); // Reset the form
    } catch (err) {
      console.error('Error submitting medication:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedication(id);
      setMedications((prev) => prev.filter((med) => med.id !== id)); // Remove the deleted medication from the state
    } catch (err) {
      console.error('Error deleting medication:', err);
    }
  };

  return (
    <div className="medication-tracker">
      <h2>Medication Tracker</h2>

      <form onSubmit={handleSubmit} className="med-form">
        <input
          name="name"
          placeholder="Medication name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="dosage"
          placeholder="Dosage"
          value={form.dosage}
          onChange={handleChange}
          required
        />
        <input
          name="days"
          placeholder="Days (e.g. Mon,Wed,Fri)"
          value={form.days}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Medication</button>
      </form>

      <div className="medication-cards">
        {Array.isArray(medications) && medications.length > 0 ? (
          medications.map((med) => (
            <div key={med.id} className="med-card">
              <h3>{med.name}</h3>
              <p><strong>Dosage:</strong> {med.dosage}</p>
              <p><strong>Days Taken:</strong> {med.days}</p>
              <button onClick={() => handleDelete(med.id)}>🗑 Delete</button>
            </div>
          ))
        ) : (
          <p>No medications found.</p>
        )}
      </div>
    </div>
  );
}
