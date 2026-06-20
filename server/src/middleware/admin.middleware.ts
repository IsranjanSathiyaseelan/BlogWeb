import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ADMIN_JWT_SECRET } from "../config/env";

type AdminJwtPayload = {
  isAdmin?: boolean;
  email?: string;
};

const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as AdminJwtPayload;

    if (!decoded || !decoded.isAdmin) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    (req as any).user = decoded;
    return next();
  } catch (error) {
    console.error("Invalid admin token:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default adminMiddleware;
