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
  "id" | "slug" | "publishedAt" | "featured" | "author"
>;

export type UpdateBlogPostInput = Partial<
  Omit<BlogPost, "id" | "slug" | "publishedAt" | "author">
>;

export interface BlogContextValue {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  categories: string[];
  getPostBySlug: (slug: string) => BlogPost | undefined;
  createPost: (post: CreateBlogPostInput) => Promise<BlogPost>;
  updatePost: (id: number, updates: UpdateBlogPostInput) => Promise<BlogPost>;
  deletePost: (id: number) => Promise<void>;
}

export interface BlogFormState {
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  readMinutes: string;
  content: string;
}