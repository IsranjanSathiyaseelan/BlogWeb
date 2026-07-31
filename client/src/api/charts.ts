import adminApi from "./adminAxios";
import api from "./axios";
import { ENDPOINTS } from "./endpoints";

// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface MonthlyActivityPoint {
  month: string;
  articles: number;
  views?: number;
}

export interface AdminMonthlyActivityPoint extends MonthlyActivityPoint {
  users: number;
  sessions: number;
}

export interface CategoryPoint {
  category: string;
  count: number;
  color: string;
}

export interface UserGrowthPoint {
  month: string;
  users: number;
  sessions: number;
}

// ─── Admin Chart API Calls (adminAxios – sends admin JWT) ─────────────────────

/**
 * Fetches monthly article, view, user, and session counts for the admin
 * activity trend chart.
 * GET /charts/admin/activity
 */
export const fetchAdminActivityChart = async (): Promise<AdminMonthlyActivityPoint[]> => {
  const { data } = await adminApi.get(ENDPOINTS.charts.adminActivity);
  return (data.monthlyActivity ?? []) as AdminMonthlyActivityPoint[];
};

/**
 * Fetches per-category post counts for the entire platform.
 * GET /charts/admin/categories
 */
export const fetchAdminCategoryChart = async (): Promise<CategoryPoint[]> => {
  const { data } = await adminApi.get(ENDPOINTS.charts.adminCategories);
  return (data.categoryDistribution ?? []) as CategoryPoint[];
};

/**
 * Fetches monthly new user registrations and session counts.
 * GET /charts/admin/user-growth
 */
export const fetchAdminUserGrowthChart = async (): Promise<UserGrowthPoint[]> => {
  const { data } = await adminApi.get(ENDPOINTS.charts.adminUserGrowth);
  return (data.userGrowth ?? []) as UserGrowthPoint[];
};

// ─── User Chart API Calls (axios – sends user JWT) ────────────────────────────

/**
 * Fetches monthly article and view counts for the authenticated user.
 * GET /charts/user/activity
 */
export const fetchUserActivityChart = async (): Promise<MonthlyActivityPoint[]> => {
  const { data } = await api.get(ENDPOINTS.charts.userActivity);
  return (data.monthlyActivity ?? []) as MonthlyActivityPoint[];
};

/**
 * Fetches per-category post counts for the authenticated user.
 * GET /charts/user/categories
 */
export const fetchUserCategoryChart = async (): Promise<CategoryPoint[]> => {
  const { data } = await api.get(ENDPOINTS.charts.userCategories);
  return (data.categoryDistribution ?? []) as CategoryPoint[];
};
