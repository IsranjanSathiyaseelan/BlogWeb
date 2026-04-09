import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/common/button/Button";
import "./SignIn.css";

interface SignInProps {
  onClose: () => void;
}

const SignIn = ({ onClose }: SignInProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await login({ email, password });
      onClose();
    } catch {
      setError("Unable to sign in. Please try again.");
    }
  };

  return (
    <div className="auth-form">
      <Button variant="ghost" onClick={onClose} className="auth-back">
        ← Back
      </Button>
      <h2 className="auth-title">Sign in</h2>
      <p className="auth-subtitle">
        Use any email and password to sign in for demo access.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="auth-input"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="auth-input"
            required
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="auth-submit"
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
};

export default SignIn;
