import {
  getKvicAuthHeaders,
} from './kvicAuthService';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000';

const request = async (
  endpoint,
  options = {}
) => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getKvicAuthHeaders(),
        ...(options.headers || {}),
      },
    }
  );

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


/* ================================
   KVIC FARMS
================================ */

export const getKvicFarms = async () => {
  return request('/api/kvic/farms');
};


export const getKvicFarm = async (
  farmId
) => {
  if (!farmId) {
    throw new Error(
      'Farm ID is required.'
    );
  }

  return request(
    `/api/kvic/farms/${farmId}`
  );
};


/* ================================
   KVIC BATCHES
================================ */

export const getKvicBatches = async (
  status = ''
) => {
  const query = status
    ? `?status=${encodeURIComponent(
        status
      )}`
    : '';

  return request(
    `/api/kvic/batches${query}`
  );
};


/* ================================
   KVIC REPORTS
   READ ONLY
================================ */

export const getKvicReports = async (
  overallResult = ''
) => {
  const query = overallResult
    ? `?overallResult=${encodeURIComponent(
        overallResult
      )}`
    : '';

  return request(
    `/api/kvic/reports${query}`
  );
};


/* ================================
   REPORT HISTORY
================================ */

export const getKvicReportHistory = async (
  batchId
) => {
  if (!batchId) {
    throw new Error(
      'Batch ID is required.'
    );
  }

  return request(
    `/api/kvic/reports/${batchId}/history`
  );
};