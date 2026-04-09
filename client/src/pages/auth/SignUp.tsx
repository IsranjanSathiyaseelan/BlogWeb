import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/common/button/Button";
import "./SignUp.css";

interface SignUpProps {
  onClose: () => void;
}

const SignUp = ({ onClose }: SignUpProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup, loading } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await signup({ email, password, name });
      onClose();
    } catch {
      setError("Unable to create an account. Please try again.");
    }
  };

  return (
    <div className="auth-form">
      <Button variant="ghost" onClick={onClose} className="auth-back">
        ← Back
      </Button>
      <h2 className="auth-title">Create your account</h2>
      <p className="auth-subtitle">
        Start publishing, bookmarking, and discovering better stories.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="auth-input"
            required
          />
        </div>

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
            placeholder="Create a strong password"
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
          {loading ? "Creating account…" : "Sign up"}
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
