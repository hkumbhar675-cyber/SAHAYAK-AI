import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Schemes API
export const getSchemes = async (params = {}) => {
  const res = await client.get('/schemes', { params });
  return res.data;
};

export const getSchemeById = async (id) => {
  const res = await client.get(`/schemes/${id}`);
  return res.data;
};

// Deterministic Rule Engine
export const checkEligibility = async (payload) => {
  const res = await client.post('/eligibility/check', payload);
  return res.data;
};

// Channel Partners API
export const getPartners = async (params = {}) => {
  const res = await client.get('/partners', { params });
  return res.data;
};

export const rankPartners = async (payload) => {
  const res = await client.post('/partners/rank', payload);
  return res.data;
};

// Financial Calculator API
export const calculateAssistance = async (payload) => {
  const res = await client.post('/calculator', payload);
  return res.data;
};

// Applications API
export const getApplications = async (user_id) => {
  const res = await client.get('/applications', { params: { user_id } });
  return res.data;
};

export const getApplicationById = async (id) => {
  const res = await client.get(`/applications/${id}`);
  return res.data;
};

export const submitApplication = async (payload) => {
  const res = await client.post('/applications', payload);
  return res.data;
};

export const updateApplicationStatus = async (id, payload) => {
  const res = await client.patch(`/applications/${id}/status`, payload);
  return res.data;
};

// AI & NLP Services
export const parseCitizenIntent = async (text, language = 'en') => {
  const res = await client.post('/ai/parse-intent', { text, language });
  return res.data;
};

export const queryAssistant = async (message, language = 'en', history = []) => {
  const res = await client.post('/ai/assistant', { message, language, history });
  return res.data;
};

export default client;
