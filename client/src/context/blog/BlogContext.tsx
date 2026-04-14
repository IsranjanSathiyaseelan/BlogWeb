import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BLOG_POSTS, BlogContext, type BlogContextValue } from "./blogStore";
import type { BlogPost } from "../../types/blog";

// eslint-disable-next-line react-refresh/only-export-components
export { useBlog } from "./blogStore";

const POSTS_STORAGE_KEY = "blogweb_posts";

const createSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const stored = localStorage.getItem(POSTS_STORAGE_KEY);

    if (!stored) return BLOG_POSTS;

    try {
      return JSON.parse(stored) as BlogPost[];
    } catch {
      return BLOG_POSTS;
    }
  });

  useEffect(() => {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const featuredPosts = useMemo(
    () => posts.filter((post) => post.featured),
    [posts]
  );

  const categories = useMemo(() => {
    const all = posts.map((post) => post.category);
    return ["All", ...Array.from(new Set(all))];
  }, [posts]);

  const getPostBySlug = useCallback(
    (slug: string) => posts.find((post) => post.slug === slug),
    [posts]
  );

  const createPost = useCallback(
    (post: Omit<BlogPost, "id" | "slug" | "publishedAt" | "featured">) => {
      const nextId = Math.max(0, ...posts.map((item) => item.id)) + 1;

      const nextPost: BlogPost = {
        ...post,
        id: nextId,
        slug: createSlug(post.title),
        publishedAt: new Date().toISOString().split("T")[0],
        featured: false,
      };

      setPosts((current) => [nextPost, ...current]);

      return nextPost;
    },
    [posts]
  );

  const updatePost = useCallback(
    (
      id: number,
      updates: Partial<Omit<BlogPost, "id" | "slug" | "publishedAt">>
    ) => {
      let updatedPost: BlogPost | undefined;

      setPosts((current) =>
        current.map((post) => {
          if (post.id !== id) return post;

          updatedPost = {
            ...post,
            ...updates,
            slug: updates.title ? createSlug(updates.title) : post.slug,
          };

          return updatedPost;
        })
      );

      return updatedPost;
    },
    []
  );

  const deletePost = useCallback((id: number) => {
    setPosts((current) => current.filter((post) => post.id !== id));
  }, []);

  const value = useMemo<BlogContextValue>(
    () => ({
      posts,
      featuredPosts,
      categories,
      getPostBySlug,
      createPost,
      updatePost,
      deletePost,
    }),
    [
      posts,
      featuredPosts,
      categories,
      getPostBySlug,
      createPost,
      updatePost,
      deletePost,
    ]
  );

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};