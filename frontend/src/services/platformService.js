const API_BASE_URL = 'http://localhost:5000';

const getToken = () => {
  return localStorage.getItem('honeychain_token');
};

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
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

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */

export const getId = (item) => {
  if (!item) return null;

  return item._id || item.id || null;
};

export const unwrap = (response) => {
  if (!response) return null;

  if (response.data !== undefined) {
    return response.data;
  }

  if (response.result !== undefined) {
    return response.result;
  }

  return response;
};

export const asArray = (response) => {
  const value = unwrap(response);

  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.items)) {
    return value.items;
  }

  if (Array.isArray(value?.farms)) {
    return value.farms;
  }

  if (Array.isArray(value?.hives)) {
    return value.hives;
  }

  if (Array.isArray(value?.batches)) {
    return value.batches;
  }

  if (Array.isArray(value?.alerts)) {
    return value.alerts;
  }

  return [];
};

/* ---------------------------------------------------------
   Farm APIs
--------------------------------------------------------- */

export const createFarm = (payload) => {
  return request('/api/farms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const listFarms = (keeperId) => {
  const query = keeperId
    ? `?keeperId=${encodeURIComponent(keeperId)}`
    : '';

  return request(`/api/farms${query}`);
};

export const getFarm = (farmId) => {
  return request(`/api/farms/${farmId}`);
};

export const updateFarm = (farmId, payload) => {
  return request(`/api/farms/${farmId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

/* ---------------------------------------------------------
   Hive APIs
--------------------------------------------------------- */

export const createHive = (payload) => {
  return request('/api/hives', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const listHives = (farmId) => {
  const query = farmId
    ? `?farmId=${encodeURIComponent(farmId)}`
    : '';

  return request(`/api/hives${query}`);
};

export const getHive = (hiveId) => {
  return request(`/api/hives/${hiveId}`);
};

/* ---------------------------------------------------------
   Sensor APIs
--------------------------------------------------------- */

export const getLatestReading = (hiveId) => {
  return request(`/api/sensors/latest/${hiveId}`);
};

export const getSensorReadings = (hiveId) => {
  return request(`/api/sensors/readings/${hiveId}`);
};

/* ---------------------------------------------------------
   Alert APIs
--------------------------------------------------------- */

export const getAlerts = (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.farmId) {
    searchParams.set('farmId', params.farmId);
  }

  if (params.hiveId) {
    searchParams.set('hiveId', params.hiveId);
  }

  if (params.status) {
    searchParams.set('status', params.status);
  }

  const query = searchParams.toString();

  return request(`/api/alerts${query ? `?${query}` : ''}`);
};

/*
 * Resolve an alert.
 *
 * Backend endpoint:
 * PATCH /api/alerts/:id/resolve
 */
export const resolveAlert = (alertId) => {
  return request(`/api/alerts/${alertId}/resolve`, {
    method: 'PATCH',
  });
};

/* ---------------------------------------------------------
   Machine Learning APIs
--------------------------------------------------------- */

export const getDiseaseRisk = (hiveId) => {
  return request(`/api/yield/disease-risk/${hiveId}`);
};

export const estimateYield = (farmId, season) => {
  return request('/api/yield/estimate', {
    method: 'POST',
    body: JSON.stringify({
      farmId,
      season,
    }),
  });
};

/* ---------------------------------------------------------
   Honey Batch APIs
--------------------------------------------------------- */

export const createBatch = (payload) => {
  return request('/api/batches', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const listBatches = (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.farmId) {
    searchParams.set('farmId', params.farmId);
  }

  if (params.keeperId) {
    searchParams.set('keeperId', params.keeperId);
  }

  const query = searchParams.toString();

  return request(`/api/batches${query ? `?${query}` : ''}`);
};

export const getBatch = (batchId) => {
  return request(`/api/batches/${batchId}`);
};

export const updateBatch = (batchId, payload) => {
  return request(`/api/batches/${batchId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

/* ---------------------------------------------------------
   Laboratory / Digital Passport APIs
--------------------------------------------------------- */

export const submitLab = (batchId, payload = {}) => {
  return request(`/api/lab/submit/${batchId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getLabReport = (batchId) => {
  return request(`/api/lab/report/${batchId}`);
};

/* ---------------------------------------------------------
   QR / Digital Passport APIs
--------------------------------------------------------- */

export const generateQr = (batchId) => {
  return request(`/api/qr/generate/${batchId}`, {
    method: 'POST',
  });
};

export const scanQr = (batchId) => {
  return request(`/api/qr/scan/${batchId}`);
};

/* ---------------------------------------------------------
   Combined platform data
--------------------------------------------------------- */

export const getPlatformData = async (keeperId) => {
  const [farmsResponse, batchesResponse] = await Promise.all([
    listFarms(keeperId),
    listBatches({ keeperId }),
  ]);

  return {
    farms: asArray(farmsResponse),
    batches: asArray(batchesResponse),
  };
};