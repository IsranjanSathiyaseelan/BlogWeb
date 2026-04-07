export type BlogCategory = "Engineering" | "Design" | "Product" | "Career";

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