import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { getUserDashboard } from "../controllers/dashboardController";

const router = Router();

router.get("/dashboard", authMiddleware, getUserDashboard);

export default router;
