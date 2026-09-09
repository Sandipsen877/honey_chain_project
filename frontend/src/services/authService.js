
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


/*
 * ============================================================
 * Generic API Request
 * ============================================================
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


/*
 * ============================================================
 * Register Keeper
 * ============================================================
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


/*
 * ============================================================
 * Verify Registration OTP
 * ============================================================
 */
export const verifyRegistrationOtp = async ({
  phone,
  otp,
}) => {
  return apiRequest('/api/keepers/verify-registration', {
    method: 'POST',

    body: JSON.stringify({
      phone: String(phone).trim(),
      code: String(otp).trim(),
    }),
  });
};


/*
 * ============================================================
 * Request Login OTP
 * ============================================================
 */
export const requestLoginOtp = async ({ phone }) => {
  return apiRequest('/api/auth/request-otp', {
    method: 'POST',

    body: JSON.stringify({
      phone: String(phone).trim(),
    }),
  });
};


/*
 * ============================================================
 * Verify Login OTP
 * ============================================================
 */
export const verifyLoginOtp = async ({
  phone,
  otp,
}) => {
  return apiRequest('/api/auth/verify-otp', {
    method: 'POST',

    body: JSON.stringify({
      phone: String(phone).trim(),
      code: String(otp).trim(),
    }),
  });
};


/*
 * ============================================================
 * Get Current Logged-In Keeper
 * ============================================================
 *
 * The JWT token is sent to the backend.
 *
 * GET /api/auth/me
 *
 * Authorization:
 * Bearer <token>
 *
 * ============================================================
 */
export const getCurrentKeeper = async (token) => {
  if (!token) {
    throw new Error('Authentication token is missing.');
  }


  return apiRequest('/api/auth/me', {
    method: 'GET',

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

