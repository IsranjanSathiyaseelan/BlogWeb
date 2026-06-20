import axios from "axios";
import { ENDPOINTS } from "./endpoints";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const ADMIN_TOKEN_KEY = "blogweb_admin_token";

const adminApi = axios.create({
  baseURL,
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

export const loginAdmin = async (email: string, password: string) => {
  const response = await adminApi.post(ENDPOINTS.admin.login, { email, password });
  return response.data as { token: string };
};

export const fetchAdminMetrics = async () => {
  const response = await adminApi.get(ENDPOINTS.admin.metrics);
  return response.data as {
    totalUsers: number;
    totalBlogs: number;
  };
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  blogCount: number;
};

export const verifyAdminToken = async () => {
  const response = await adminApi.get(ENDPOINTS.admin.verify);
  return response.data as { valid: true; user: { isAdmin?: boolean; email?: string } };
};

export const fetchAdminUsers = async () => {
  const response = await adminApi.get(ENDPOINTS.admin.users);
  return response.data as { users: AdminUser[] };
};

export const deleteAdminUser = async (id: number) => {
  await adminApi.delete(ENDPOINTS.admin.deleteUser(id));
};
