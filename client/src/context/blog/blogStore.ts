import { createContext, useContext } from "react";
import type { BlogContextValue } from "../../types/blog";

export const BlogContext = createContext<BlogContextValue | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);

  if (!context) {
    throw new Error("useBlog must be used within BlogProvider");
  }

  return context;
};
