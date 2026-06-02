import { Link, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import "../../pages.css";
import "./SignIn.css";

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <section className="page auth-page">
      <div className="content-panel" style={{ maxWidth: 520, width: "100%" }}>
        <Link to="/" className="text-link">
          Back home
        </Link>
        <SignIn onClose={() => navigate("/")} />
      </div>
    </section>
  );
};

export default SignInPage;
