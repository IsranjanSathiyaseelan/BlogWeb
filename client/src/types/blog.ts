export type BlogCategory = string;

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  imageUrl: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  category: BlogCategory;
  featured: boolean;
}

export type CreateBlogPostInput = Omit<
  BlogPost,
  "id" | "slug" | "publishedAt" | "featured"
>;

export type UpdateBlogPostInput = Partial<
  Omit<BlogPost, "id" | "slug" | "publishedAt">
>;

export interface BlogContextValue {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  categories: string[];
  getPostBySlug: (slug: string) => BlogPost | undefined;
  createPost: (post: CreateBlogPostInput) => BlogPost;
  updatePost: (id: number, updates: UpdateBlogPostInput) => BlogPost | undefined;
  deletePost: (id: number) => void;
}

export interface BlogFormState {
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  readMinutes: string;
  content: string;
}