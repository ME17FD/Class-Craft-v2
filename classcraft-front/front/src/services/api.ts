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
    if (!token) {
      // Redirect to login if no token exists
      window.location.href = "/";
      return Promise.reject(new Error("No authentication token found"));
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);
export default api;