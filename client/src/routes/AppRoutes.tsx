import { Navigate, Route, Routes } from "react-router-dom";
import AboutPage from "../pages/AboutPage";
import BlogPostPage from "../pages/BlogPostPage";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/myblog" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
