import { useAuthContext } from "../context/auth/AuthContext";

const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
