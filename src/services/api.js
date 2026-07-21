import { toast } from '../utils/toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://160-153-179-249.sslip.io';

export function getToken()    { return localStorage.getItem('vigil_token') || null; }
export function getUser()     { try { return JSON.parse(localStorage.getItem('vigil_user') || 'null'); } catch { return null; } }
export function getParentId() { const u = getUser(); return u?._id || u?.id || null; }

export function logout() {
  localStorage.removeItem('vigil_token');
  localStorage.removeItem('vigil_user');
  localStorage.removeItem('vigil_refresh_token');
  localStorage.removeItem('vigil_selected_child');
}

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

export const getGeoZones = (parentId, childId) =>
  childId
    ? request(`/api/geozones/${parentId}/${childId}`)
    : request(`/api/geozones/${parentId}`);

export const createGeoZone = (payload) =>
  request('/api/geozones/create', { method: 'POST', body: JSON.stringify(payload) });

export const deleteGeoZone = (id) => request(`/api/geozones/${id}`, { method: 'DELETE' });

export const toggleGeoZone = (id) => request(`/api/geozones/${id}/toggle`, { method: 'PATCH' });

// ── Subscriptions ─────────────────────────────────────────────────────────────

export const getMySubscription = () => request('/api/subscriptions/my');

export const getPlans = () => request('/api/subscriptions/plans');

export const createCheckoutSession = (payload) =>
  request('/api/payments/initiate', { method: 'POST', body: JSON.stringify(payload) });

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const getDashboardSummary = () => request('/api/parent-data/dashboard-summary');

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
