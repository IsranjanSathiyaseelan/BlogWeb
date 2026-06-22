import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/button/Button";
import { loginAdmin } from "../../api/admin";
import "./AdminLoginPage.css";

const ADMIN_TOKEN_KEY = "blogweb_admin_token";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/admin/dashboard";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const { token } = await loginAdmin(email.trim(), password);
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Invalid admin credentials. Please try again.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-card__title">Admin Sign In</h1>
        <p className="admin-login-card__subtitle">
          Enter your admin credentials to access the dashboard.
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="admin-login-form__label" htmlFor="admin-email">
            Email
          </label>
          <input
            id="admin-email"
            className="admin-login-form__input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@gmail.com"
            autoComplete="username"
            required
          />

          <label className="admin-login-form__label" htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            className="admin-login-form__input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />

          {error && <div className="admin-login-form__error">{error}</div>}

          <Button
            type="submit"
            variant="primary"
            className="admin-login-form__submit"
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
