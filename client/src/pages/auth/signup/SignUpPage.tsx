import { Link, useNavigate } from "react-router-dom";
import SignUp from "./SignUp";
import "../../pages.css";
import "./SignUp.css";

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <section className="page auth-page">
      <div className="content-panel" style={{ maxWidth: 520, width: "100%" }}>
        <Link to="/" className="text-link">
          Back home
        </Link>
        <SignUp onClose={() => navigate("/")} />
      </div>
    </section>
  );
};

export default SignUpPage;
