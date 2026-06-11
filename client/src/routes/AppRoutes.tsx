import { Route, Routes } from "react-router-dom";
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
import MainLayout from "../components/layouts/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-blogs" element={<AllBlogs />} />
        <Route path="/blogs" element={<AllBlogs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/myblog" element={<MyBlogs />} />
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
