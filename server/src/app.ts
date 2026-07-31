import express from "express";
import cors from "cors";
import { getHealth } from "./controllers/healthController";
import blogRoutes from "./routes/blogRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import chartsRoutes from "./routes/chartsRoutes";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/api", getHealth);
app.use("/api", blogRoutes);
app.use("/api", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/charts", chartsRoutes);

export { app };