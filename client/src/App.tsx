import "./App.css";
import Navbar from "./components/common/navbar/Navbar";
import Footer from "./components/common/footer/Footer";
import { BlogProvider } from "./context/BlogContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <BlogProvider>
      <div className="app">
        <Navbar />
        <main className="app-main">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BlogProvider>
  );
};

export default App;