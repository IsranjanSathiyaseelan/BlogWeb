
import { Link } from "react-router-dom";
import "./SignUpPage.css";
import type { FormEvent } from "react";

const SignUpPage = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: handle signup logic here
    console.log("Sign up submitted");
  };

  return (
    <main className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>

        <h2 className="signup-title">Create your account</h2>

        <p className="signup-subtitle">
          Start publishing, bookmarking, and discovering better stories.
        </p>

        {/* Full Name */}
        <div className="signup-field">
          <label>Full name</label>
          <input type="text" placeholder="Your name" required />
        </div>

        {/* Email */}
        <div className="signup-field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" required />
        </div>

        {/* Password */}
        <div className="signup-field">
          <label>Password</label>
          <input type="password" placeholder="Create a strong password" required />
        </div>

        {/* Button */}
        <button type="submit" className="signup-button">
          Sign up
        </button>

        <p className="signup-footer">
          Already have an account?{" "}
          <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </main>
  );
};

export default SignUpPage;