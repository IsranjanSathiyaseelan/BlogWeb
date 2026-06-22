import { Navigate, Route, Routes } from "react-router-dom";
import AboutPage from "../pages/AboutPage";
import AllBlogs from "../pages/AllBlogs";
import BlogPostPage from "../pages/BlogPostPage";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import MyBlogs from "../pages/MyBlogs";
import PrivacyPage from "../pages/PrivacyPage";
import SignInPage from "../pages/auth/signin/SignInPage";
import SignUpPage from "../pages/auth/signup/SignUpPage";
import TermsPage from "../pages/TermsPage";
import CookiesPage from "../pages/CookiesPage";
import UserDashboard from "../pages/UserDashboard";
import MainLayout from "../components/layouts/MainLayout";
import AdminGuard from "../components/admin/AdminGuard";
import AdminLayout from "../components/admin/AdminLayout";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-blogs" element={<AllBlogs />} />
        <Route path="/blogs" element={<AllBlogs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/myblog" element={<MyBlogs />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
