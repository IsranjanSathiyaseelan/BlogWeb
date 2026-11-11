export type BlogCategory = string;

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Blog {
  id: string;
  title: string;
  content: string[];
  userId: string;
  createdAt: Date;
}

export interface UserWithBlogs extends User {
  blogs: Blog[];
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  imageUrl?: string;
  author: string;
  authorEmail?: string;
  publishedAt: string;
  publishedDate?: string;
  readMinutes: number;
  readingTime?: string;
  category: BlogCategory;
  featured: boolean;
  keywords?: string[];
  isDummy?: boolean;
}

export type CreateBlogPostInput = Omit<
  BlogPost,
  "id" | "slug" | "publishedAt" | "featured" | "author" | "imageUrl"
>;

export type UpdateBlogPostInput = Partial<
  Omit<BlogPost, "id" | "slug" | "publishedAt" | "author" | "imageUrl">
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
  category: string;
  readMinutes: string;
  content: string;
}