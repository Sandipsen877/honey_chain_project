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
 * Register keeper
 *
 * POST /api/keepers
 *
 * The backend sends an OTP to the provided phone number.
 */
export const registerKeeper = async ({
  keeperCode,
  name,
  phone,
  email,
  address,
}) => {
  return apiRequest('/api/keepers', {
    method: 'POST',
    body: JSON.stringify({
      keeperCode,
      name,
      phone: String(phone).trim(),
      email,
      address,
    }),
  });
};

/**
 * Verify registration OTP
 *
 * POST /api/keepers/verify-registration
 */
export const verifyRegistrationOtp = async ({ phone, otp }) => {
  return apiRequest('/api/keepers/verify-registration', {
    method: 'POST',
    body: JSON.stringify({
      phone: String(phone).trim(),
      code: String(otp).trim(),
    }),
  });
};

/**
 * Request login OTP
 *
 * POST /api/auth/request-otp
 */
export const requestLoginOtp = async ({ phone }) => {
  return apiRequest('/api/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({
      phone: String(phone).trim(),
    }),
  });
};

/**
 * Verify login OTP
 *
 * POST /api/auth/verify-otp
 */
export const verifyLoginOtp = async ({ phone, otp }) => {
  return apiRequest('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({
      phone: String(phone).trim(),
      code: String(otp).trim(),
    }),
  });
};