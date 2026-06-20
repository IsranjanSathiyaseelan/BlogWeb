import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ADMIN_JWT_SECRET, JWT_SECRET } from "../config/env";

type JwtPayload = {
  id?: number | string;
  isAdmin?: boolean;
  email?: string;
};

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  // Try normal user token first
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const userId =
      typeof decoded.id === "string" && /^[0-9]+$/.test(decoded.id)
        ? Number(decoded.id)
        : decoded.id;

    req.user = {
      id: userId as number | undefined,
      isAdmin: !!decoded.isAdmin,
      email: decoded.email,
    };

    return next();
  } catch (err) {
    // Not a normal user token, try admin token
  }

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as JwtPayload;

    req.user = {
      isAdmin: !!decoded.isAdmin,
      email: decoded.email,
    };

    return next();
  } catch (error) {
    console.error("Invalid token:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;