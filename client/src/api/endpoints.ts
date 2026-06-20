export const ENDPOINTS = {
  auth: {
    login: "/login",
    signup: "/signup",
    me: "/me",
  },
  posts: {
    list: "/posts",
    me: "/posts/my",
    detailBySlug: (slug: string) => `/posts/${slug}`,
    detailById: (id: number | string) => `/posts/${id}`,
  },
  admin: {
    login: "/admin/login",
    verify: "/admin/verify",
    metrics: "/admin/metrics",
    users: "/admin/users",
    deleteUser: (id: number | string) => `/admin/users/${id}`,
  },
};
