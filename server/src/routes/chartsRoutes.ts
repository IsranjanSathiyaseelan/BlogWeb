import { Router } from "express";
import adminMiddleware from "../middleware/admin.middleware";
import authMiddleware from "../middleware/auth.middleware";
import {
  getAdminActivityChart,
  getAdminCategoryChart,
  getAdminUserGrowthChart,
  getUserActivityChart,
  getUserCategoryChart,
} from "../controllers/chartsController";

const router = Router();

// ─── Admin chart routes (require admin token) ─────────────────────────────────
router.get("/admin/activity", adminMiddleware, getAdminActivityChart);
router.get("/admin/categories", adminMiddleware, getAdminCategoryChart);
router.get("/admin/user-growth", adminMiddleware, getAdminUserGrowthChart);

// ─── User chart routes (require user auth token) ──────────────────────────────
router.get("/user/activity", authMiddleware, getUserActivityChart);
router.get("/user/categories", authMiddleware, getUserCategoryChart);

export default router;
