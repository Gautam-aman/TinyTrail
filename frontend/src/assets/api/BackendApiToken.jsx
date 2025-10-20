import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Request Interceptor: Attaches the JWT token to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const tokenString = localStorage.getItem('JWT_TOKEN');

    if (tokenString) {
      let token = tokenString;
      
      try {
        // Handle token stored as a JSON string (e.g., '"mytokenvalue"')
        const parsed = JSON.parse(tokenString);
        // Use the parsed value only if it's a valid string.
        if (typeof parsed === 'string' && parsed.length > 0) {
          token = parsed;
        }
      } catch (e) {
        // If parsing fails, token remains tokenString.
      }
      
      // CRITICAL CHECK: Ensure the token is a non-empty string before setting the header.
      if (typeof token === 'string' && token.length > 0) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;