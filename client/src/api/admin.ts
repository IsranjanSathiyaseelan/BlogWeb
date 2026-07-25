import adminApi from "./adminAxios";
import { ENDPOINTS } from "./endpoints";


export type AdminUser = {
  id:number | string;
  name:string;
  email:string;
  role?:string;
  created_at:string;
  updated_at:string;
  blogCount?:number;
};



export const loginAdmin = async (
  email:string,
  password:string
) => {

  const {data} = await adminApi.post(
    ENDPOINTS.admin.login,
    {
      email,
      password
    }
  );


  return data as {
    token:string;
  };
};



export const verifyAdminToken = async () => {

  const {data} = await adminApi.get(
    ENDPOINTS.admin.verify
  );


  return data;
};



export const fetchAdminMetrics = async () => {

  const {data} = await adminApi.get(
    ENDPOINTS.admin.metrics
  );


  return data as {
    totalUsers:number;
    totalBlogs:number;
    revenue?:number;
    activeSessions?:number;
  };
};



export const fetchAdminUsers = async () => {

  const {data} = await adminApi.get(
    ENDPOINTS.admin.users
  );


  return data as {
    users:AdminUser[];
  };
};



export const deleteAdminUser = async (
  id:number|string
) => {

  await adminApi.delete(
    ENDPOINTS.admin.deleteUser(id)
  );

};