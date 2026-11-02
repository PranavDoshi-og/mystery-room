import axios from 'axios';

export const getBaseUrl = () => {
  const custom = typeof window !== 'undefined' ? localStorage.getItem('mystery_api_url') : null;
  if (custom && custom.trim()) {
    return custom.trim().replace(/\/+$/, '');
  }
  return import.meta.env.VITE_API_BASE_URL || '/api';
};

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dynamic baseURL interceptor
api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return config;
});

export const caseApi = {
  getApiUrl: () => getBaseUrl(),

  setApiUrl: (url) => {
    let clean = url.trim().replace(/\/+$/, '');
    if (!clean.endsWith('/api') && !clean.includes('/api/')) {
      clean = `${clean}/api`;
    }
    localStorage.setItem('mystery_api_url', clean);
    return clean;
  },

  resetApiUrl: () => {
    localStorage.removeItem('mystery_api_url');
  },

  // Get recent cases
  getRecentCases: async () => {
    const res = await api.get('/cases');
    return res.data;
  },

  // Create / Generate a new mystery
  createCase: async ({ premise, difficulty }) => {
    const res = await api.post('/cases', { premise, difficulty });
    return res.data;
  },

  // Get active case
  getCase: async (id) => {
    const res = await api.get(`/cases/${id}`);
    return res.data;
  },

  // Discover a clue
  discoverClue: async (id, clueId) => {
    const res = await api.post(`/cases/${id}/clues/${clueId}/discover`);
    return res.data;
  },

  // Request a hint
  requestHint: async (id) => {
    const res = await api.post(`/cases/${id}/hints`);
    return res.data;
  },

  // Submit an accusation
  submitAccusation: async (id, { accusedSuspectId, motiveNotes }) => {
    const res = await api.post(`/cases/${id}/accuse`, { accusedSuspectId, motiveNotes });
    return res.data;
  },

  // Get completed result
  getResult: async (id) => {
    const res = await api.get(`/cases/${id}/result`);
    return res.data;
  },

  // Health check
  checkHealth: async (overrideUrl) => {
    const targetUrl = overrideUrl ? `${overrideUrl.replace(/\/+$/, '')}/health` : `${getBaseUrl()}/health`;
    const res = await axios.get(targetUrl, { timeout: 8000 });
    return res.data;
  }
};

export default api;
