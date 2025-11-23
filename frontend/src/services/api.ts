import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds - increased for bcrypt operations
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // DEV: log rich error details for easier troubleshooting (response body, request body)
    if (import.meta.env.DEV) {
      try {
        const status = error.response?.status;
        const url = (error.config && (error.config.url || '')) as string;
        console.debug('[apiClient] axios error', { url, status, message: error.message, response: error.response?.data, requestData: error.config && error.config.data });
      } catch (e) {
        // best effort logging
        console.debug('[apiClient] error logging failed', e);
      }
    }
    // If the request returned 401, generally we clear auth and redirect to login.
    // But for authentication endpoints (login / register / refresh) we should NOT
    // force-redirect so the page can show server error messages. Only redirect for
    // other API endpoints where the app must re-auth.
    const status = error.response?.status;
    const url = (error.config && (error.config.url || '')) as string;
    const isAuthEndpoint = /\/api\/users\/(login|register|refresh)/i.test(url);

    // If 401 on a non-auth endpoint, attempt to refresh the token once and
    // retry the original request (helps the initialization flow where we try
    // to fetch /api/users/profile while a token exists but may be expired).
    if (status === 401 && !isAuthEndpoint) {
      const originalRequest: any = (error.config as any) || {};

      // only attempt refresh once to avoid loops
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // call refresh directly with global axios (so we don't hit this same interceptor)
          const refreshUrl = `${API_BASE_URL}/api/users/refresh`;
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.debug('[apiClient] 401 received — attempting refresh', { refreshUrl });
          }
          const refreshRes = await axios.post(refreshUrl, {}, { withCredentials: true });
          const refreshed = refreshRes?.data?.data;
          const newToken = refreshed?.token;
          const newUser = refreshed?.user || refreshed;

          if (newToken) {
            // persist new token and user
            localStorage.setItem('token', newToken);
            if (newUser) {
              try {
                localStorage.setItem('user', JSON.stringify(newUser));
              } catch {}
            }

            // set default header so apiClient retries with new token
            apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // retry the original request
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
            // fall through and clear auth (refresh failed)
            if (import.meta.env.DEV) {
              // eslint-disable-next-line no-console
              console.debug('[apiClient] refresh attempt failed (will clear auth)', refreshErr?.response?.data || refreshErr?.message || refreshErr);
            }
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.debug('[apiClient] refresh attempt failed', refreshErr);
          }
        }
      }

      // If we get here, refresh didn't succeed or was already attempted.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // If the server returned a helpful message or validation errors, surface those
    try {
      const respData: any = error.response?.data;
      // prefer singular message
      if (respData?.message) {
        error.message = respData.message;
      } else if (Array.isArray(respData?.errors) && respData.errors.length > 0) {
        // build a compact message from validation errors
        const msgs = respData.errors.map((e: any) => e.message || JSON.stringify(e));
        error.message = msgs.join('; ');
      }
    } catch (_) {
      // ignore if we can't read the response body
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};
