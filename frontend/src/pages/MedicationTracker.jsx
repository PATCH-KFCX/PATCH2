import React, { useState, useEffect, useRef } from 'react';
import { fetchMedications, addMedication, deleteMedication } from '../adapters/medications-adapter';
import '../styles/MedicationTracker.css';

const COMMON_MEDS = [
  "Metformin", "Lisinopril", "Atorvastatin", "Levothyroxine", "Amlodipine",
  "Omeprazole", "Simvastatin", "Losartan", "Gabapentin", "Hydrochlorothiazide"
];

const DOSAGE_UNITS = ["mg", "mcg", "g", "IU", "ml", "tablet(s)", "capsule(s)"];
const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MedicationTracker() {
  const [medications, setMedications] = useState([]);
  const [form, setForm] = useState({ name: '', dosage: '', unit: 'mg', days: [] });
  const [suggestions, setSuggestions] = useState([]);
  const [daysDropdownOpen, setDaysDropdownOpen] = useState(false);
  const daysDropdownRef = useRef();

  useEffect(() => {
    const loadMedications = async () => {
      try {
        const meds = await fetchMedications();
        setMedications(Array.isArray(meds) ? meds : []);
      } catch (err) {
        console.error('Error fetching medications:', err);
      }
    };
    loadMedications();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (daysDropdownRef.current && !daysDropdownRef.current.contains(event.target)) {
        setDaysDropdownOpen(false);
      }
    }
    if (daysDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [daysDropdownOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Autocomplete for medication name
    if (name === "name") {
      if (value.length > 0) {
        const filtered = COMMON_MEDS.filter(med =>
          med.toLowerCase().startsWith(value.toLowerCase())
        );
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setForm((prev) => ({ ...prev, name: suggestion }));
    setSuggestions([]);
  };

  const handleDayToggle = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMed = await addMedication({ ...form, days: form.days.join(',') });
      setMedications((prev) => [...prev, newMed]);
      setForm({ name: '', dosage: '', unit: 'mg', days: [] });
      setSuggestions([]);
    } catch (err) {
      console.error('Error submitting medication:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedication(id);
      setMedications((prev) => prev.filter((med) => med.id !== id));
    } catch (err) {
      console.error('Error deleting medication:', err);
    }
  };

  return (
    <div className="medication-tracker medical-bg">
      <div className="medication-header">
        <h2>Medication Tracker</h2>
        <p className="medication-subtitle">
          Log and manage your medications. Stay on track with your health.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="med-form minimalist-form" autoComplete="off">
        <div className="med-form-row" style={{ flexWrap: "wrap" }}>
          <div className="med-form-group" style={{ flex: 2, position: "relative", minWidth: 220 }}>
            <label htmlFor="med-name">Medication</label>
            <input
              id="med-name"
              name="name"
              placeholder="e.g. Metformin"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="off"
              className="med-form-input"
            />
            {suggestions.length > 0 && (
              <ul className="autocomplete-list">
                {suggestions.map((s, i) => (
                  <li key={i} onClick={() => handleSuggestionClick(s)}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="med-form-group" style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="med-dosage">Dosage</label>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                id="med-dosage"
                name="dosage"
                placeholder="e.g. 500"
                value={form.dosage}
                onChange={handleChange}
                required
                className="med-form-input"
                type="number"
                min="0"
                style={{ flex: 2 }}
              />
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="med-form-input"
                style={{ flex: 1, minWidth: 60 }}
              >
                {DOSAGE_UNITS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="med-form-row" style={{ marginTop: 10 }}>
          <div className="med-form-group" style={{ flex: 1, minWidth: 160, maxWidth: 260 }}>
            <label>Days Taken</label>
            <div className="days-checkbox-group" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {DAYS_OF_WEEK.map((day) => (
                <label key={day} className="days-checkbox-label" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <input
                    type="checkbox"
                    checked={form.days.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                  {day}
                </label>
              ))}
              {form.days.length > 0 && (
                <button
                  type="button"
                  className="days-checkbox-clear"
                  onClick={() => setForm((prev) => ({ ...prev, days: [] }))}
                  style={{
                    marginLeft: 8,
                    background: "none",
                    border: "none",
                    color: "#0077b6",
                    cursor: "pointer",
                    fontSize: "0.97em",
                    fontWeight: 500,
                    padding: "0 6px"
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        <button type="submit" className="med-form-submit">+ Add Medication</button>
      </form>

      <div
        className="medication-cards minimalist-cards scrollable-med-cards"
        style={{
          maxHeight: "340px",
          overflowY: "auto",
          margin: "0 auto",
          width: "100%",
          maxWidth: "800px",
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 2px 12px rgba(0,119,182,0.06)",
          padding: "1.2rem 1.2rem 1.2rem 1.2rem",
        }}
      >
        {Array.isArray(medications) && medications.length > 0 ? (
          medications.map((med) => (
            <div key={med.id} className="med-card medication-item">
              <h3>{med.name}</h3>
              <p>
                <strong>Dosage:</strong>
                <span style={{ marginLeft: 4 }}>
                  {med.dosage}
                  <span style={{ marginLeft: 3, fontWeight: 500 }}>
                    {med.unit || 'mg'}
                  </span>
                </span>
              </p>
              <p>
                <strong>Days Taken:</strong>
                <span style={{ marginLeft: 4 }}>
                  {Array.isArray(med.days)
                    ? med.days.join(', ')
                    : med.days}
                </span>
              </p>
              <button onClick={() => handleDelete(med.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p className="no-meds-message">No medications found.</p>
        )}
      </div>
    </div>
  );
}
