const BASE_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  try {
    const raw = localStorage.getItem('vigil_parent_token');
    return raw || null;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const login = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (payload) =>
  request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });

export const requestPasswordReset = (email) =>
  request('/api/auth/request-password-reset', { method: 'POST', body: JSON.stringify({ email }) });

export const verifyOtp = (email, otp) =>
  request('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) });

export const resetPassword = (email, otp, newPassword) =>
  request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, otp, newPassword }) });

// ─── Children ────────────────────────────────────────────────────────────────

export const getChildren = () =>
  request('/api/children');

export const getChildById = (id) =>
  request(`/api/children/${id}`);

export const getChildrenByParentId = (parentId) =>
  request(`/api/children/childrens/${parentId}`);

export const createChild = (payload) =>
  request('/api/children', { method: 'POST', body: JSON.stringify(payload) });

export const editChild = (childId, name) =>
  request(`/api/children/${childId}/update-name`, { method: 'PUT', body: JSON.stringify({ name }) });

export const deleteChild = (childId) =>
  request(`/api/children/${childId}`, { method: 'DELETE' });

export const updateDeviceName = (childId, deviceName) =>
  request(`/api/children/${childId}/update-device-name`, { method: 'PUT', body: JSON.stringify({ deviceName }) });

export const updateDeviceStatus = (childId, status) =>
  request(`/api/children/${childId}/device-status`, { method: 'PUT', body: JSON.stringify({ status }) });

// ─── Activity ────────────────────────────────────────────────────────────────

export const getActivityOverview = (childId) =>
  request(`/api/children/${childId}/activity-overview`);

// ─── Location ────────────────────────────────────────────────────────────────

export const getChildLocation = (childId) =>
  request(`/api/children/${childId}/location`);

export const getLocationHistory = (childId) =>
  request(`/api/children/${childId}/location-history`);

export const updateChildLocation = (childId, payload) =>
  request(`/api/children/${childId}/location`, { method: 'PUT', body: JSON.stringify(payload) });

// ─── Geofencing ──────────────────────────────────────────────────────────────

export const getGeoZones = (parentId, childId) =>
  childId
    ? request(`/api/geozones/${parentId}/${childId}`)
    : request(`/api/geozones/${parentId}`);

export const createGeoZone = (payload) =>
  request('/api/geozones/create', { method: 'POST', body: JSON.stringify(payload) });

export const deleteGeoZone = (id) =>
  request(`/api/geozones/${id}`, { method: 'DELETE' });

export const toggleGeoZone = (id) =>
  request(`/api/geozones/${id}/toggle`, { method: 'PATCH' });

// ─── Device Data (aggregated — calls, SMS, apps, contacts, location) ─────────

export const getDeviceData = (parentId) =>
  request(`/api/deviceData/${parentId}`);

// ─── Permissions ─────────────────────────────────────────────────────────────

export const updatePlayProtect = (childId, status) =>
  request(`/api/children/${childId}/play-protect-status`, { method: 'PUT', body: JSON.stringify({ status }) });

export const updateAccessibility = (childId, status) =>
  request(`/api/children/${childId}/accessibility-status`, { method: 'PUT', body: JSON.stringify({ status }) });

export const updateSupervision = (childId, status) =>
  request(`/api/children/${childId}/supervision-status`, { method: 'PUT', body: JSON.stringify({ status }) });

export const updateNotificationAccess = (childId, payload) =>
  request(`/api/children/${childId}/notification-access-status`, { method: 'PUT', body: JSON.stringify(payload) });

export const updateAdministratorAccess = (childId, status) =>
  request(`/api/children/${childId}/administrator-access-status`, { method: 'PUT', body: JSON.stringify({ status }) });

export const updateDataAccess = (childId, payload) =>
  request(`/api/children/${childId}/data-access-status`, { method: 'PUT', body: JSON.stringify(payload) });

export const updateBatteryOptimization = (childId, status) =>
  request(`/api/children/${childId}/battery-optimization-status`, { method: 'PUT', body: JSON.stringify({ status }) });

// ─── Pairing ─────────────────────────────────────────────────────────────────

export const generatePairingCode = (childId) =>
  request('/api/children/generate-pairing-code', { method: 'POST', body: JSON.stringify({ childId }) });

export const checkPairingCodeStatus = (childId) =>
  request('/api/children/check-pairing-code-status', { method: 'POST', body: JSON.stringify({ childId }) });
