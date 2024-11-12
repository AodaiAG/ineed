import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Enable cookies
});

// Response interceptor to handle token expiration or missing token
api.interceptors.response.use(
    response => response, // Allow successful responses through
    error => {
        // Pass the error response so the component can handle navigation
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.log('User unauthorized or refresh token expired');
        }
        return Promise.reject(error);
    }
);
export default api;
