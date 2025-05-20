export const updateSymptom = async (id, updatedData) => {
  const response = await fetch(`/api/symptoms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) throw new Error('Failed to update symptom');
  return await response.json();
};
