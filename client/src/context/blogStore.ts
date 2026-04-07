import { createContext, useContext } from "react";
import type { BlogPost } from "../types/blog";

export interface BlogContextValue {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  categories: string[];
  getPostBySlug: (slug: string) => BlogPost | undefined;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "ship-features-with-confidence",
    title: "Ship Features With Confidence",
    excerpt:
      "A practical release checklist that helps teams launch faster with fewer regressions.",
    content: [
      "Great product teams do not ship less. They ship with intention. A lightweight release checklist can improve confidence without slowing momentum.",
      "Start by defining a release owner, a measurable goal, and a rollback plan. If those three are clear, your launch can move quickly.",
      "Before going live, verify analytics events, document support notes, and run a focused smoke test across the top three user paths.",
      "After launch, review your goal metric within 24 hours and summarize outcomes in a short retro. This closes the loop and compounds learning.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    author: "Aisha Raman",
    publishedAt: "2026-03-18",
    readMinutes: 6,
    category: "Product",
    featured: true,
  },
  {
    id: 2,
    slug: "frontend-architecture-that-scales",
    title: "Frontend Architecture That Scales",
    excerpt:
      "How to split components, routes, and state so your React codebase stays clean as it grows.",
    content: [
      "Most frontend complexity comes from unclear boundaries, not large files. Begin with route-level ownership and keep shared UI intentionally small.",
      "Move data concerns into feature contexts or custom hooks. Keep presentational components pure and easy to test.",
      "Create folders around user journeys instead of technical layers when possible. This helps new engineers onboard faster.",
      "Set conventions for naming and import paths early. Consistency is a force multiplier at scale.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    author: "Daniel Choi",
    publishedAt: "2026-03-10",
    readMinutes: 8,
    category: "Engineering",
    featured: true,
  },
  {
    id: 3,
    slug: "designing-for-focus-not-noise",
    title: "Designing for Focus, Not Noise",
    excerpt:
      "Visual hierarchy techniques that improve readability and reduce cognitive load.",
    content: [
      "Users do not read interfaces top to bottom. They scan for meaning. Your hierarchy should guide that scan naturally.",
      "Use one dominant headline, one supporting action, and controlled contrast. Too many accents compete for attention.",
      "Whitespace is not empty. It is structure. Treat spacing as a design tool, not a leftover.",
      "When in doubt, simplify. Clarity converts better than novelty.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80",
    author: "Leena Park",
    publishedAt: "2026-02-22",
    readMinutes: 5,
    category: "Design",
    featured: false,
  },
  {
    id: 4,
    slug: "career-growth-for-junior-devs",
    title: "Career Growth for Junior Developers",
    excerpt:
      "A simple 90-day framework to build visibility, trust, and technical depth.",
    content: [
      "Career growth is usually a sequence of small wins. Pick one technical area and one communication skill each quarter.",
      "Share progress in writing. Weekly updates build trust and make your impact visible.",
      "Ask for feedback tied to outcomes, not personality. For example: Was my API proposal clear and actionable?",
      "Consistency beats intensity. Small improvements compound quickly across a year.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
    author: "Rohan Patel",
    publishedAt: "2026-02-04",
    readMinutes: 7,
    category: "Career",
    featured: false,
  },
];

export const BlogContext = createContext<BlogContextValue | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);

  if (!context) {
    throw new Error("useBlog must be used within BlogProvider");
  }

  return context;
};