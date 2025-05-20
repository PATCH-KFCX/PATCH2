const BASE_URL = '/api/medications';

export const fetchMedications = async () => {
  try {
    const response = await fetch('/api/medications', {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch medications');
    }
    return await response.json();
  } catch (err) {
    console.error('Error fetching medications:', err);
    throw err;
  }
};

export const addMedication = async (medication) => {
  try {
    const response = await fetch('/api/medications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medication),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to add medication');
    }
    return await response.json();
  } catch (err) {
    console.error('Error adding medication:', err);
    throw err;
  }
};

export const deleteMedication = async (id) => {
  try {
    const response = await fetch(`/api/medications/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete medication');
    }
    return await response.json();
  } catch (err) {
    console.error('Error deleting medication:', err);
    throw err;
  }
};
