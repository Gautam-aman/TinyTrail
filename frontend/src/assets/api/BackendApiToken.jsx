import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
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
      } catch (e) {
      
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