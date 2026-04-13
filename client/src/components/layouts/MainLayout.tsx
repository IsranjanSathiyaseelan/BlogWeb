import { Outlet } from "react-router-dom";
import Footer from "../common/footer/Footer";
import Navbar from "../common/navbar/Navbar";
import "../common/navbar/Navbar.css";
import "../common/footer/Footer.css";

const MainLayout = () => (
  <div className="app">
    <Navbar />
    <main className="app-main">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
