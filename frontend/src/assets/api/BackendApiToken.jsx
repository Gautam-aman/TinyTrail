import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
});


api.interceptors.request.use(
  (config) => {
    const tokenString = localStorage.getItem('JWT_TOKEN');

    if (tokenString) {
      let token = tokenString;
      
      try {
        
        const parsed = JSON.parse(tokenString);
       
        if (typeof parsed === 'string' && parsed.length > 0) {
          token = parsed;
        }
      } catch {
        token = tokenString;
      }
      
     
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
