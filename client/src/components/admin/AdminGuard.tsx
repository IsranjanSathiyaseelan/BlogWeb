import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { verifyAdminToken } from "../../api/admin";

const ADMIN_TOKEN_KEY = "blogweb_admin_token";

const AdminGuard = () => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (!token) {
      setAuthorized(false);
      setChecking(false);
      return;
    }

    const verify = async () => {
      try {
        await verifyAdminToken();
        setAuthorized(true);
      } catch (error) {
        console.error("Admin token verification failed", error);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, []);

  if (checking) {
    return <div>Checking admin access…</div>;
  }

  if (!authorized) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AdminGuard;
