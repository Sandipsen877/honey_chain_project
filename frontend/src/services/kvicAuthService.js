const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const KVIC_TOKEN_KEY = 'honeychain_kvic_token';
const KVIC_ADMIN_KEY = 'honeychain_kvic_admin';

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
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
};


/*
 * ============================================================
 * KVIC ADMIN REGISTER
 * ============================================================
 */
export const registerKvicAdmin = async ({
  name,
  email,
  password,
  inviteCode,
}) => {
  return apiRequest('/api/kvic/auth/register', {
    method: 'POST',

    body: JSON.stringify({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      inviteCode: inviteCode.trim(),
    }),
  });
};


/*
 * ============================================================
 * KVIC ADMIN LOGIN
 * ============================================================
 */
export const loginKvicAdmin = async ({
  email,
  password,
}) => {
  const data = await apiRequest('/api/kvic/auth/login', {
    method: 'POST',

    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  if (data?.token) {
    localStorage.setItem(
      KVIC_TOKEN_KEY,
      data.token
    );
  }

  if (data?.admin) {
    localStorage.setItem(
      KVIC_ADMIN_KEY,
      JSON.stringify(data.admin)
    );
  }

  return data;
};


/*
 * ============================================================
 * GET KVIC TOKEN
 * ============================================================
 */
export const getKvicToken = () => {
  return localStorage.getItem(KVIC_TOKEN_KEY);
};


/*
 * ============================================================
 * GET STORED ADMIN
 * ============================================================
 */
export const getStoredKvicAdmin = () => {
  try {
    const admin = localStorage.getItem(
      KVIC_ADMIN_KEY
    );

    return admin ? JSON.parse(admin) : null;
  } catch {
    return null;
  }
};


/*
 * ============================================================
 * KVIC AUTH HEADER
 * ============================================================
 */
export const getKvicAuthHeaders = () => {
  const token = getKvicToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};


/*
 * ============================================================
 * KVIC LOGOUT
 * ============================================================
 */
export const logoutKvicAdmin = () => {
  localStorage.removeItem(KVIC_TOKEN_KEY);
  localStorage.removeItem(KVIC_ADMIN_KEY);
};


/*
 * ============================================================
 * KVIC AUTH STATUS
 * ============================================================
 */
export const isKvicAuthenticated = () => {
  return Boolean(getKvicToken());
};