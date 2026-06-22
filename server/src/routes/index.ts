import { Router } from "express";
import dashboardRoutes from "./dashboardRoutes";
import adminRoutes from "./adminRoutes";
import blogRoutes from "./blogRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/", blogRoutes);
router.use("/", userRoutes);

export default router;
