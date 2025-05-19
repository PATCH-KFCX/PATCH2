import React, { useState, useEffect } from 'react';
import '../styles/MedicationTracker.css';
import MedicationCard from '../components/MedicationCard';

const COMMON_MEDICATIONS = [
  'Ibuprofen', 'Paracetamol', 'Amoxicillin', 'Metformin', 'Aspirin',
  'Atorvastatin', 'Omeprazole', 'Losartan', 'Levothyroxine', 'Albuterol',
  'Gabapentin', 'Hydrochlorothiazide', 'Sertraline', 'Citalopram', 'Prednisone'
];
const UNITS = ['mg', 'ml', 'g', 'tablets', 'capsules'];
const FREQUENCIES = ['Once a day', 'Twice a day', 'Three times a day', 'Every 6 hours', 'Every 8 hours'];

export default function MedicationTracker() {
  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    unit: 'mg',
    frequency: 'Once a day',
  });

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch('/api/medications', { credentials: 'include' });
        const data = await response.json();
        setMedications(data);
      } catch (err) {
        console.error('Error fetching medications:', err);
      }
    };

    fetchMedications();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newMedication = await response.json();
        setMedications((prev) => [...prev, newMedication]);
        setFormData({ name: '', dosage: '', unit: 'mg', frequency: 'Once a day' });
      }
    } catch (err) {
      console.error('Error adding medication:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/medications/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setMedications((prev) => prev.filter((med) => med.id !== id));
      }
    } catch (err) {
      console.error('Error deleting medication:', err);
    }
  };

  return (
    <div className="medication-tracker-container">
      <h1>Medication Tracker</h1>

      <form className="medication-form" onSubmit={handleSubmit}>
        {/* Autocomplete for Medication Name */}
        <input
          type="text"
          name="name"
          list="medication-list"
          placeholder="Medication Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <datalist id="medication-list">
          {COMMON_MEDICATIONS.map((med) => (
            <option key={med} value={med} />
          ))}
        </datalist>

        {/* Combined Dosage and Unit */}
        <div className="dosage-unit-group">
          <input
            type="number"
            name="dosage"
            placeholder="Dosage"
            value={formData.dosage}
            onChange={handleInputChange}
            required
          />
          <select
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            required
          >
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown for Frequency */}
        <select
          name="frequency"
          value={formData.frequency}
          onChange={handleInputChange}
          required
        >
          {FREQUENCIES.map((freq) => (
            <option key={freq} value={freq}>
              {freq}
            </option>
          ))}
        </select>

        <button type="submit">Add Medication</button>
      </form>

      <div className="medication-list">
        {medications.map((med) => (
          <MedicationCard key={med.id} medication={med} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}