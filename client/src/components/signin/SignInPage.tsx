import { Link } from "react-router-dom";
import "./SignInPage.css";
import type { FormEvent } from "react";

const SignInPage = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // TODO: handle login logic here
    console.log("Login submitted");
  };

  return (
    <main className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        
        <h2 className="signin-title">Sign in</h2>

        <p className="signin-subtitle">
          Please enter email and password to access.
        </p>

        {/* Email */}
        <div className="signin-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Please enter your email"
            required
          />
        </div>

        {/* Password */}
        <div className="signin-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Please enter your password"
            required
          />
        </div>

        {/* Button */}
        <button type="submit" className="signin-button">
          Login
        </button>

        <p className="signin-footer">
          Don't have an account?{" "}
          <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </main>
  );
};

export default SignInPage;