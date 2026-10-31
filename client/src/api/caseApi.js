import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const caseApi = {
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
  checkHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  }
};

export default api;
