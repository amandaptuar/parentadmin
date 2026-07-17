<<<<<<< HEAD
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
=======
import { toast } from '../utils/toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://160-153-179-249.sslip.io';

export function getToken()    { return localStorage.getItem('vigil_token') || null; }
export function getUser()     { try { return JSON.parse(localStorage.getItem('vigil_user') || 'null'); } catch { return null; } }
export function getParentId() { const u = getUser(); return u?._id || u?.id || null; }

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request(path, options = {}, silent = false) {
  try {
    const headers = { 'Content-Type': 'application/json', ...authHeaders(), ...options.headers };
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.message || data.msg || `Request failed (${res.status})`;
      if (!silent) toast.error(msg);
      throw new Error(msg);
    }
    return data;
  } catch (err) {
    if (err.name === 'TypeError' && !silent) {
      toast.error('Network error — check your connection.');
    }
    throw err;
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────
>>>>>>> f24dd3eebaefecadfd39370506218c4d6b64f04f

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

<<<<<<< HEAD
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
=======
// ── Profile ───────────────────────────────────────────────────────────────────

export const getProfile = () => request('/api/parents/profile');

export const updateProfile = (data) =>
  request('/api/parents/profile', { method: 'PUT', body: JSON.stringify(data) });

// ── Children ──────────────────────────────────────────────────────────────────

export const getChildren = () => request('/api/children');

export const getChildById = (id) => request(`/api/children/${id}`);

export const getLiveStatus = (childId) => request(`/api/children/${childId}/live-status`);

export const getActivityOverview = (childId) => request(`/api/children/${childId}/activity-overview`);

// ── Location ──────────────────────────────────────────────────────────────────

export const getChildLocation = (childId) => request(`/api/children/${childId}/location`);

export const getLocationHistory = (childId, hours = 24) =>
  request(`/api/children/${childId}/location-history?hours=${hours}`);

// ── Geofences ─────────────────────────────────────────────────────────────────
>>>>>>> f24dd3eebaefecadfd39370506218c4d6b64f04f

export const getGeoZones = (parentId, childId) =>
  childId
    ? request(`/api/geozones/${parentId}/${childId}`)
    : request(`/api/geozones/${parentId}`);

export const createGeoZone = (payload) =>
  request('/api/geozones/create', { method: 'POST', body: JSON.stringify(payload) });

<<<<<<< HEAD
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

// ─── Subscriptions & Payments ─────────────────────────────────────────────────

export const getPlans = () =>
  request('/api/subscriptions/plans');

export const getMySubscription = () =>
  request('/api/subscriptions/my');

export const createCheckoutSession = (payload) =>
  request('/api/payments/initiate', { method: 'POST', body: JSON.stringify(payload) });

// ─── Pairing ─────────────────────────────────────────────────────────────────

export const generatePairingCode = (childId) =>
  request('/api/children/generate-pairing-code', { method: 'POST', body: JSON.stringify({ childId }) });

export const checkPairingCodeStatus = (childId) =>
  request('/api/children/check-pairing-code-status', { method: 'POST', body: JSON.stringify({ childId }) });
=======
export const deleteGeoZone = (id) => request(`/api/geozones/${id}`, { method: 'DELETE' });

export const toggleGeoZone = (id) => request(`/api/geozones/${id}/toggle`, { method: 'PATCH' });

// ── Subscriptions ─────────────────────────────────────────────────────────────

export const getMySubscription = () => request('/api/subscriptions/my');

export const getPlans = () => request('/api/subscriptions/plans');

// ── Parent-facing monitoring data ─────────────────────────────────────────────

export const getChildSms = (childId, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`/api/parent-data/children/${childId}/sms${q ? '?' + q : ''}`);
};

export const getChildCalls = (childId, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`/api/parent-data/children/${childId}/calls${q ? '?' + q : ''}`);
};

export const getChildApps = (childId, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`/api/parent-data/children/${childId}/apps${q ? '?' + q : ''}`);
};
>>>>>>> f24dd3eebaefecadfd39370506218c4d6b64f04f
