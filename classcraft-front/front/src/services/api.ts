// api.ts (new file)
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true, // Important for cookies/sessions
    headers: {
      'Content-Type': 'application/json',
    }
  });

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Ne pas rediriger automatiquement, laisser App.tsx gérer
    }
    return Promise.reject(error);
  }
);

console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
export default api;