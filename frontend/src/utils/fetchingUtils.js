const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

// DELETE request options
export const deleteOptions = {
  method: 'DELETE',
  credentials: 'include',
};

// POST request options with body
export const getPostOptions = (body) => ({
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

// PATCH request options with body
export const getPatchOptions = (body) => ({
  method: 'PATCH',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

// Universal fetch handler
export const fetchHandler = async (url, options = {}) => {
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const { ok, status, headers } = response;

    if (!ok) {
      throw new Error(`Fetch failed with status - ${status}`, {
        cause: status,
      });
    }

    const contentType = headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    // ✅ Safely parse JSON only if content exists
    let responseData = null;
    if (isJson) {
      const text = await response.text();
      responseData = text ? JSON.parse(text) : null;
    } else {
      responseData = await response.text();
    }

    return [responseData, null];
  } catch (error) {
    console.warn(error);
    return [null, error];
  }
};
