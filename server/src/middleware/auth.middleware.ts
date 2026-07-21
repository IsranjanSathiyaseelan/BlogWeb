import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

type JwtPayload = {
  id: number | string;
  role: string;
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

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const userId =
      typeof decoded.id === "string" && /^[0-9]+$/.test(decoded.id)
        ? Number(decoded.id)
        : decoded.id;

    req.user = {
      id: userId as number,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("Invalid token:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;