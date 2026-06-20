import api from "./axios";
import type { AuthCredentials, AuthUser } from "../types/auth";
import { ENDPOINTS } from "./endpoints";

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export type SignupResponse = LoginResponse;

export const login = async (
  credentials: AuthCredentials,
): Promise<LoginResponse> => {
  const response = await api.post(ENDPOINTS.auth.login, credentials);
  return response.data as LoginResponse;
};

export const signup = async (
  credentials: AuthCredentials,
): Promise<SignupResponse> => {
  const response = await api.post(ENDPOINTS.auth.signup, credentials);
  return response.data as SignupResponse;
};

export const getCurrentUser = async (): Promise<{ user: AuthUser }> => {
  const response = await api.get(ENDPOINTS.auth.me);
  return response.data as { user: AuthUser };
};
