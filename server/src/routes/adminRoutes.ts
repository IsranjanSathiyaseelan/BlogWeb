import { Router } from "express";
import adminMiddleware from "../middleware/admin.middleware";
import {
  loginAdmin,
  verifyAdmin,
  getAdminMetrics,
  getAdminUsers,
  deleteAdminUser,
} from "../controllers/adminController";

const router = Router();

router.post("/login", loginAdmin);
router.use(adminMiddleware);
router.get("/verify", verifyAdmin);
router.get("/metrics", getAdminMetrics);
router.get("/users", getAdminUsers);
router.delete("/users/:id", deleteAdminUser);

export default router;
