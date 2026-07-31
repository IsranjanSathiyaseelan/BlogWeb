import { Router } from "express";
import dashboardRoutes from "./dashboardRoutes";
import adminRoutes from "./adminRoutes";
import blogRoutes from "./blogRoutes";
import userRoutes from "./userRoutes";
import chartsRoutes from "./chartsRoutes";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/charts", chartsRoutes);
router.use("/", blogRoutes);
router.use("/", userRoutes);

export default router;
