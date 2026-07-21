import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../config/prisma";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "SuperSecurePassword2026!";
const ADMIN_JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ?? process.env.JWT_SECRET ?? "adminsecret";

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { role: "ADMIN", username },
      ADMIN_JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to sign in admin" });
  }
};

export const verifyAdmin = async (req: Request, res: Response) => {
  // adminMiddleware has already verified the token and attached it to req.user
  const admin = (req as any).user;
  return res.status(200).json({ valid: true, admin });
};

export const getAdminMetrics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const activeSessions = null;
    const revenue = null;

    return res.json({
      totalUsers,
      revenue,
      activeSessions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to fetch admin metrics" });
  }
};

export const getAdminUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return res.json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to fetch users" });
  }
};

export const deleteAdminUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    await prisma.user.delete({ where: { id } });
    return res.status(204).send();
  } catch (error: any) {
    // Prisma throws P2025 when the record to delete doesn't exist
    if (error?.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }

    console.error(error);
    return res.status(500).json({ error: "Unable to delete user" });
  }
};
