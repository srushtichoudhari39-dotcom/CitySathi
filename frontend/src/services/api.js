const BASE_URL = '/api';

export async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Health
  getHealth: () => fetchJson('/health'),

  // Places
  getPlaces: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.query) query.append('query', params.query);
    if (params.maxBudget) query.append('max_budget', params.maxBudget);
    if (params.minRating) query.append('min_rating', params.minRating);
    if (params.indoorOnly) query.append('indoor_only', 'true');
    const qs = query.toString();
    return fetchJson(`/places${qs ? `?${qs}` : ''}`);
  },

  getPlaceById: (id) => fetchJson(`/places/${id}`),

  // Culture
  getCultureItems: () => fetchJson('/culture'),
  getCultureById: (id) => fetchJson(`/culture/${id}`),

  // Safety
  getSafetyZones: (type = '') => fetchJson(`/safety/zones${type ? `?zone_type=${type}` : ''}`),
  computeSaferRoute: (payload) =>
    fetchJson('/safety/safer-route', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Comparisons
  getPresetComparisons: () => fetchJson('/compare/presets'),
  compareCustom: (place1_id, place2_id) =>
    fetchJson('/compare/custom', {
      method: 'POST',
      body: JSON.stringify({ place1_id, place2_id }),
    }),

  // SmartPlan
  generateSmartPlan: (payload) =>
    fetchJson('/smartplan', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Insights & Reports
  getInsights: () => fetchJson('/insights'),
  getReports: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.category) query.append('category', params.category);
    const qs = query.toString();
    return fetchJson(`/insights/reports${qs ? `?${qs}` : ''}`);
  },
  submitReport: (payload) =>
    fetchJson('/insights/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  upvoteReport: (reportId) =>
    fetchJson(`/insights/reports/${reportId}/upvote`, {
      method: 'POST',
    }),
  verifyReport: (reportId) =>
    fetchJson(`/insights/reports/${reportId}/verify`, {
      method: 'POST',
    }),
};
