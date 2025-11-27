import axios from "axios";

// Prefer VITE_API_URL from .env (Vite exposes env vars via import.meta.env).
// Fall back to the hardcoded local IP if not provided.
const rawBase = import.meta.env.VITE_API_URL

console.log(rawBase);

// Normalize and ensure the base ends with '/api'
const baseUrl = rawBase.endsWith("/api")
    ? rawBase
    : rawBase.replace(/\/$/, "") + "/api";

// Root base (without trailing /api) – used for CSRF cookie preflight
export const rootBase = baseUrl.replace(/\/api$/, "");

// Axios instance configured for Laravel Sanctum session-based auth
const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true, // send/receive cookies
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    xsrfCookieName: "XSRF-TOKEN", // Laravel's default XSRF cookie name
    xsrfHeaderName: "X-XSRF-TOKEN", // Axios will read cookie and set this header automatically
});

// Lazy CSRF acquisition to support POST/PUT/DELETE safely across origins
let csrfReady = false;
export async function ensureCsrfCookie() {
    if (csrfReady) return;
    // Hitting /sanctum/csrf-cookie sets XSRF-TOKEN and session cookies
    await axios.get(`${rootBase}/sanctum/csrf-cookie`, {
        withCredentials: true,
        headers: {
            Accept: "application/json",
        },
    });
    csrfReady = true;
}

// Helper function to get cookie value by name
function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
}

// Request interceptor: ensure CSRF cookie exists before mutating requests
api.interceptors.request.use(
    async (config) => {
        const method = (config.method || "get").toLowerCase();
        const isMutating = ["post", "put", "patch", "delete"].includes(
            method,
        );

        if (isMutating) {
            await ensureCsrfCookie();
            
            // Manually read XSRF-TOKEN from cookie and set header
            const token = getCookie("XSRF-TOKEN");
            if (token) {
                config.headers["X-XSRF-TOKEN"] = token;
            }
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor: normalize common auth/session errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        // 401 Unauthorized or 419 CSRF token mismatch -> surface to caller
        if (status === 401 || status === 419) {
            // Optional: emit a custom event that consumers can listen to
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("auth:unauthorized"));
            }
        }
        return Promise.reject(error);
    },
);

export default api;
