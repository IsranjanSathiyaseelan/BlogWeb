export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
}

export interface BlogWithAuthor extends Blog {
  authorName: string;
  authorEmail: string;
}

export interface AdminStats {
  totalUsers: number;
  totalBlogs: number;
}
