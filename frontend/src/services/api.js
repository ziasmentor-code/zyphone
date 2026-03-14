// services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add token to every request
api.interceptors.request.use(
    (config) => {
        // Try both access_token and access (for compatibility)
        const token = localStorage.getItem('access_token') || localStorage.getItem('access');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
        } else {
            console.warn('No token found for request:', config.url);
        }
        
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
    (response) => {
        // Successful response
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Log error details
        console.error('API Error:', {
            url: originalRequest?.url,
            method: originalRequest?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token') || localStorage.getItem('refresh');
                
                if (!refreshToken) {
                    // No refresh token, redirect to login
                    console.warn('No refresh token available');
                    clearAuthAndRedirect();
                    return Promise.reject(error);
                }
                
                // Try to refresh the token
                const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                    refresh: refreshToken
                });
                
                if (response.data.access) {
                    // Save new token
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('access', response.data.access); // For compatibility
                    
                    // Update authorization header
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    
                    // Retry original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                clearAuthAndRedirect();
                return Promise.reject(refreshError);
            }
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            console.error('Access forbidden');
            toast.error('You do not have permission to perform this action');
        }

        // Handle 404 Not Found
        if (error.response?.status === 404) {
            console.error('Resource not found:', originalRequest?.url);
        }

        // Handle 500 Internal Server Error
        if (error.response?.status === 500) {
            console.error('Server error:', error.response?.data);
        }

        // Handle network errors
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
        }

        if (!error.response) {
            console.error('Network error - server may be down');
        }

        return Promise.reject(error);
    }
);

// Helper function to clear auth and redirect
const clearAuthAndRedirect = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    
    // Only redirect if we're in a browser environment
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};

// Helper functions for common requests
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('access_token', token);
        localStorage.setItem('access', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('access');
        delete api.defaults.headers.common['Authorization'];
    }
};

export const setRefreshToken = (token) => {
    if (token) {
        localStorage.setItem('refresh_token', token);
        localStorage.setItem('refresh', token);
    } else {
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('refresh');
    }
};

export const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
};

export const isAuthenticated = () => {
    return !!(localStorage.getItem('access_token') || localStorage.getItem('access'));
};

export default api;