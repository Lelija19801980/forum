import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5500/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Tokeno prijungimas prie kiekvienos užklausos
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Galima pridėti ir atsakymo klaidų interceptor (nebūtina, bet naudinga debuginant)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API klaida:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;


