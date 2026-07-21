import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import {
  AdminLoginRequest,
  AdminPayload,
} from "../types/admin.types";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ;
const JWT_SECRET = process.env.JWT_SECRET ;

export const loginAdmin = async (
  req: Request<{}, {}, AdminLoginRequest>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        error: "Invalid admin credentials",
      });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({
        error: "JWT secret is not configured",
      });
    }

    const payload: AdminPayload = {
      role: "ADMIN",
      email,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to sign in admin",
    });
  }
};


export const verifyAdmin = async (req: Request, res: Response) => {
  const admin = (req as any).user;

  return res.status(200).json({
    valid: true,
    admin,
  });
};

export const getAdminMetrics = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();

    return res.json({
      totalUsers,
      revenue: null,
      activeSessions: null,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to fetch admin metrics",
    });
  }
};

export const getAdminUsers = async (_req: Request, res: Response) => {
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
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return res.json({ users });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to fetch users",
    });
  }
};

export const deleteAdminUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "Invalid user id",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.sendStatus(204);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({
        error: "User not found",
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "Unable to delete user",
    });
  }
};
