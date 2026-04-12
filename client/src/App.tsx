import "./App.css";
import { AuthProvider } from "./context/auth/AuthContext";
import { BlogProvider } from "./context/blog/BlogContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <AuthProvider>
      <BlogProvider>
        <AppRoutes />
      </BlogProvider>
    </AuthProvider>
  );
};

export default App;
