import express from "express";
import { checkDbConnection } from "./config/db";

const app = express();

app.use(express.json());

app.get("/api", async (_req, res) => {
  const dbConnected = await checkDbConnection();

  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    message: "API is running",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

export { app };