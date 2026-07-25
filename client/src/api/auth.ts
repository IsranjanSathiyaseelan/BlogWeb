import api from "./axios";
import { ENDPOINTS } from "./endpoints";


export type AuthUser = {
  id: number | string;
  name: string;
  email: string;
  createdAt?: string;
};


export type AuthResponse = {
  token: string;
  user: AuthUser;
};



export const login = async (
  credentials: {
    email:string;
    password:string;
  }
) => {

  const {data} = await api.post(
    ENDPOINTS.auth.login,
    credentials
  );

  return data as AuthResponse;
};



export const signup = async (
  credentials:{
    email:string;
    password:string;
    name:string;
  }
) => {

  if(!credentials.name){
    throw new Error("Name is required");
  }


  const {data} = await api.post(
    ENDPOINTS.auth.signup,
    credentials
  );


  return data as AuthResponse;
};



export const getCurrentUser = async () => {

  const {data} = await api.get(
    ENDPOINTS.auth.me
  );


  return data as {
    user:AuthUser;
  };
};



export const verifyUserToken = async () => {

  const {data} = await api.get(
    ENDPOINTS.auth.me
  );


  return data as {
    user:AuthUser;
  };
};