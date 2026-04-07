import { useMemo, type ReactNode } from "react";
import { BLOG_POSTS, BlogContext, type BlogContextValue } from "./blogStore";

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const featuredPosts = useMemo(
    () => BLOG_POSTS.filter((post) => post.featured),
    [],
  );

  const categories = useMemo(() => {
    const all = BLOG_POSTS.map((post) => post.category);
    return ["All", ...new Set(all)];
  }, []);

  const value = useMemo<BlogContextValue>(
    () => ({
      posts: BLOG_POSTS,
      featuredPosts,
      categories,
      getPostBySlug: (slug: string) =>
        BLOG_POSTS.find((post) => post.slug === slug),
    }),
    [categories, featuredPosts],
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
