import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { verifyUserToken } from "../../api/auth";

const USER_TOKEN_KEY = "blogweb_token";

const UserGuard = () => {
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(USER_TOKEN_KEY);

    if (!token) {
      setAuthorized(false);
      setChecking(false);
      return;
    }

    const verify = async () => {
      try {
        await verifyUserToken();

        setAuthorized(true);
      } catch (error) {
        console.error("User token verification failed", error);

        localStorage.removeItem(USER_TOKEN_KEY);

        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, []);

  if (checking) {
    return <div>Checking user access...</div>;
  }

  if (!authorized) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default UserGuard;
