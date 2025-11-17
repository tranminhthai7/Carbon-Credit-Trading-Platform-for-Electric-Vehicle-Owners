import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds - increased for bcrypt operations
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies, used for refresh token cookie
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
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Try to refresh access token using cookie
      const refreshUrl = `${API_BASE_URL}/api/users/refresh`;
      return axios.post(
        refreshUrl,
        {},
        { withCredentials: true }
      ).then((resp) => {
        const token = (resp.data?.data?.token);
        const user = (resp.data?.data?.user);
        if (token) {
          localStorage.setItem('token', token);
          if (user) localStorage.setItem('user', JSON.stringify(user));
        }
        // Retry original request with new token
        const config = error.config as any;
        config.headers = config.headers || {};
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return axios(config);
      }).catch((_) => {
        // Refresh failed - clear storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      });
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
