import express from "express";
import {
  signupUser,
  loginUser,
  getCurrentUser,
} from "../controllers/userController";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getCurrentUser);

export default router;