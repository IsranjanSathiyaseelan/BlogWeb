import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/button/Button";
import { loginAdmin } from "../../api/admin";
import "./AdminLoginPage.css";

const ADMIN_TOKEN_KEY = "blogweb_admin_token";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/admin/dashboard";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { token } = await loginAdmin(email, password);
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      navigate(from, { replace: true });
    } catch {
      setError("Invalid administrative credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Header (No Icon) */}
        <div className="admin-login-card__header">
          <span className="admin-login-card__badge">Admin Console</span>
          <h1 className="admin-login-card__title">Sign in to your account</h1>
          <p className="admin-login-card__subtitle">
            Secure authentication for platform management and telemetry.
          </p>
        </div>

        {error && (
          <div className="admin-login-form__error">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="admin-login-form__field">
            <label className="admin-login-form__label" htmlFor="admin-email">
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              className="admin-login-form__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              autoComplete="email"
              required
              disabled={submitting}
            />
          </div>

          {/* Password Field with Professional Toggle */}
          <div className="admin-login-form__field">
            <div className="admin-login-form__label-row">
              <label
                className="admin-login-form__label"
                htmlFor="admin-password"
              >
                Password
              </label>
            </div>
            <div className="admin-login-form__password-wrapper">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                className="admin-login-form__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                disabled={submitting}
              />
              <button
                type="button"
                className="admin-login-form__toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="admin-login-form__submit"
            disabled={submitting}
          >
            {submitting ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        <footer className="admin-login-card__footer">
          <p>Restricted access. Authorized personnel only.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLoginPage;