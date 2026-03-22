import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5007/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const uploadImages = (formData, onProgress) =>
  api.post('/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  });

export const extractText = (filename, language) =>
  api.post('/extract-text', { filename, language });

export const cleanText = (text) => api.post('/clean-text', { text });

export const generateNotes = (text) => api.post('/generate-notes', { text });

export const translateText = (text, targetLanguage) =>
  api.post('/translate', { text, targetLanguage });

export const summarizeText = (text) => api.post('/summarize', { text });

export const generatePDF = (title, content) =>
  api.post('/generate-pdf', { title, content }, { responseType: 'blob' });

export const saveScan = (data) => api.post('/save-scan', data);

export const getHistory = () => api.get('/history');

export const deleteScan = (id) => api.delete(`/history/${id}`);

export const getLanguages = () => api.get('/languages');

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const signup = (name, email, password) =>
  api.post('/auth/signup', { name, email, password });

export default api;
