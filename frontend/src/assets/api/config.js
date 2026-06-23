export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const buildApiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
