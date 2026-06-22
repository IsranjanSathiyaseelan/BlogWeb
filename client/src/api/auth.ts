import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await api.post(ENDPOINTS.auth.login, credentials);
  return response.data as AuthResponse;
};

export const signup = async (credentials: {
  email: string;
  password: string;
  name?: string;
}) => {
  if (!credentials.name) {
    throw new Error("Name is required for signup");
  }

  const response = await api.post(ENDPOINTS.auth.signup, credentials);
  return response.data as AuthResponse;
};

export const getCurrentUser = async () => {
  const response = await api.get(ENDPOINTS.auth.me);
  return response.data as { user: AuthUser };
};

export const loginAdmin = async (
  email: string,
  password: string
) => {
  const response = await api.post(ENDPOINTS.admin.login, { email, password });
  return response.data as { token: string };
};

export const fetchAdminMetrics = async () => {
  const response = await api.get(ENDPOINTS.admin.metrics);
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
  const response = await api.get(ENDPOINTS.admin.verify);
  return response.data as {
    valid: boolean;
    user: {
      isAdmin?: boolean;
      email?: string;
    };
  };
};

export const fetchAdminUsers = async () => {
  const response = await api.get(ENDPOINTS.admin.users);
  return response.data as {
    users: AdminUser[];
  };
};

export const deleteAdminUser = async (id: number | string) => {
  await api.delete(ENDPOINTS.admin.deleteUser(id));
};
