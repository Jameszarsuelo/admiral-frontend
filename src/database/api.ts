import axios from "axios";

// Prefer VITE_API_URL from .env (Vite exposes env vars via import.meta.env).
// Fall back to the hardcoded local IP if not provided.
const DEFAULT_API_URL = "http://192.168.100.125:8000";
const rawBase =
    (typeof import.meta !== "undefined" &&
        import.meta.env &&
        import.meta.env.VITE_API_URL) ||
    DEFAULT_API_URL;

// Normalize and ensure the base ends with '/api'
const baseUrl = rawBase.endsWith("/api")
    ? rawBase
    : rawBase.replace(/\/$/, "") + "/api";

// Create an Axios instance with the resolved base URL
const api = axios.create({
    baseURL: baseUrl,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token"); // Adjust the key if necessary
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        // Ensure backend receives the user_id on POST and PUT requests when available

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default api;
