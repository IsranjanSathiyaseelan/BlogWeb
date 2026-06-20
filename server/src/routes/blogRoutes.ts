import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostBySlug,
  getUserPosts,
  updatePost,
} from "../controllers/blogController";

const router = Router();

router.get("/posts", getAllPosts);
router.get("/posts/my", authMiddleware, getUserPosts);
router.get("/posts/:slug", getPostBySlug);
router.post("/posts", authMiddleware, createPost);
router.put("/posts/:id", authMiddleware, updatePost);
router.delete("/posts/:id", authMiddleware, deletePost);

export default router;
