import { Request, Response } from "express";
import { checkDbConnection } from "../config/db";

export const getHealth = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dbConnected = await checkDbConnection();

    res.status(dbConnected ? 200 : 503).json({
      status: dbConnected ? "ok" : "degraded",
      message: "API is running",
      database: dbConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
      database: "unknown",
      timestamp: new Date().toISOString(),
    });
  }
};