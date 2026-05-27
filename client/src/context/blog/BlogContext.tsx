import { useCallback, useEffect, useState, type ReactNode } from "react";
import { BLOG_POSTS, BlogContext } from "./blogStore";
import type {
  BlogContextValue,
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "../../types/blog";
import * as postsApi from "../../api/posts";

// eslint-disable-next-line react-refresh/only-export-components
export { useBlog } from "./blogStore";

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const backendPosts = await postsApi.getPosts();
        setPosts(backendPosts);
      } catch (error) {
        console.error("Unable to load blog posts from backend:", error);
      }
    };

    loadPosts();
  }, []);

  const featuredPosts = posts.filter((post) => post.featured);

  const all = posts.map((post) => post.category);
  const categories = ["All", ...Array.from(new Set(all))];

  const getPostBySlug = useCallback(
    (slug: string) => posts.find((post) => post.slug === slug),
    [posts],
  );

  const createPost = useCallback(async (post: CreateBlogPostInput) => {
    const created = await postsApi.createPost(post);
    setPosts((current) => [created, ...current]);
    return created;
  }, []);

  const updatePost = useCallback(
    async (id: number, updates: UpdateBlogPostInput) => {
      const updated = await postsApi.updatePost(id, updates);
      setPosts((current) =>
        current.map((post) => (post.id === id ? updated : post)),
      );
      return updated;
    },
    [],
  );

  const deletePost = useCallback(async (id: number) => {
    await postsApi.deletePost(id);
    setPosts((current) => current.filter((post) => post.id !== id));
  }, []);

  const value: BlogContextValue = {
    posts,
    featuredPosts,
    categories,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
