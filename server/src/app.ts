import express from "express";
import { getHealth } from "./controllers/healthController";
import blogRoutes from "./routes/blogRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());

app.get("/api", getHealth);
app.use("/api", blogRoutes);
app.use("/api", userRoutes);

export { app };