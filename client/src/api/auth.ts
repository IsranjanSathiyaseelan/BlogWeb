import api from "./axios";
import type { AuthCredentials, AuthUser } from "../types/auth";

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export type SignupResponse = LoginResponse;

export const login = async (
  credentials: AuthCredentials,
): Promise<LoginResponse> => {
  const response = await api.post("/login", credentials);
  return response.data as LoginResponse;
};

export const signup = async (
  credentials: AuthCredentials,
): Promise<SignupResponse> => {
  const response = await api.post("/signup", credentials);
  return response.data as SignupResponse;
};

export const getCurrentUser = async (): Promise<{ user: AuthUser }> => {
  const response = await api.get("/me");
  return response.data as { user: AuthUser };
};
