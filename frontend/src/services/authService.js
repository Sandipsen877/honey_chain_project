const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Generic API request helper
 */
const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
};

/**
 * Register a new user
 */
export const registerUser = async ({
  keeperCode,
  name,
  phone,
  email,
  address,
}) => {
  return apiRequest('/api/auth/register', {
    method: 'POST',

    body: JSON.stringify({
      keeperCode,
      name,
      phone,
      email,
      address,
    }),
  });
};

/**
 * Login existing user
 * Phone number is sent as a String
 */
export const loginUser = async ({ phone }) => {
  return apiRequest('/api/auth/login', {
    method: 'POST',

    body: JSON.stringify({
      phone: String(phone).trim(),
    }),
  });
};