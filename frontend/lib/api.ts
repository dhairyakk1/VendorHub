import axios from 'axios';

const API = axios.create({
  baseURL: 'https://vendorhub-backend-579d.onrender.com/api',
});

// Automatically attach token to every request if logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;