export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
}

export interface AdminPayload {
  role: "ADMIN";
  email: string;
}

export interface AdminMetrics {
  totalUsers: number;
  revenue: number | null;
  activeSessions: number | null;
}
