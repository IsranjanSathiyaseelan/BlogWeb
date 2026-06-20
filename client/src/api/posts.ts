import type { BlogPost } from "../types/blog";
import api from "./axios";
import { ENDPOINTS } from "./endpoints";
import { images } from "../assets/asset";

export type CreateBlogPostPayload = Omit<
  BlogPost,
  "id" | "slug" | "publishedAt" | "featured" | "author" | "imageUrl"
> & {
  imageUrl?: string;
  content: string[];
};

export type UpdateBlogPostPayload = Partial<CreateBlogPostPayload>;

const serializeContent = (content: string[] | string): string =>
  typeof content === "string" ? content : content.join("\n");

const normalizePost = (post: any): BlogPost => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  content:
    typeof post.content === "string"
      ? post.content
          .split(/\r?\n/)
          .map((line: string) => line.trim())
          .filter(Boolean)
      : post.content,
  imageUrl: post.imageUrl ?? post.image_url ?? images.post,
  author: post.author ?? post.author_name ?? `Author ${post.author_id}`,
  publishedAt: post.publishedAt ?? post.published_at,
  readMinutes: post.readMinutes ?? post.read_minutes,
  category: post.category,
  featured: post.featured,
});

export const getPosts = async (): Promise<BlogPost[]> => {
  const response = await api.get(ENDPOINTS.posts.list);
  return (response.data as any[]).map(normalizePost);
};

export const getPostBySlug = async (slug: string): Promise<BlogPost> => {
  const response = await api.get(ENDPOINTS.posts.detailBySlug(slug));
  return normalizePost(response.data);
};

export const getMyPosts = async (): Promise<BlogPost[]> => {
  const response = await api.get(ENDPOINTS.posts.me);
  return (response.data as any[]).map(normalizePost);
};

export const createPost = async (
  payload: CreateBlogPostPayload,
): Promise<BlogPost> => {
  const response = await api.post(ENDPOINTS.posts.list, {
    ...payload,
    content: serializeContent(payload.content),
  });
  return normalizePost(response.data);
};

export const updatePost = async (
  id: number,
  payload: UpdateBlogPostPayload,
): Promise<BlogPost> => {
  const body = {
    ...payload,
    ...(payload.content
      ? { content: serializeContent(payload.content) }
      : {}),
  };

  const response = await api.put(ENDPOINTS.posts.detailById(id), body);
  return normalizePost(response.data);
};

export const deletePost = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.posts.detailById(id));
};
