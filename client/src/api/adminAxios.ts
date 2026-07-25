import axios from "axios";

const ADMIN_TOKEN_KEY = "blogweb_admin_token";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default adminApi;