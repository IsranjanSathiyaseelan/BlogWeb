import crypto from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { JWT_SECRET } from "../config/env";

// ----------------------
// Helpers
// ----------------------

const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.randomBytes(16).toString("hex");

  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey as Buffer);
    });
  });

  return `${salt}$${derived.toString("hex")}`;
};

const verifyPassword = async (
  password: string,
  storedHash: string
): Promise<boolean> => {
  const [salt, keyHex] = storedHash.split("$");

  if (!salt || !keyHex) return false;

  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey as Buffer);
    });
  });

  const expected = Buffer.from(keyHex, "hex");

  if (derived.length !== expected.length) return false;

  return crypto.timingSafeEqual(derived, expected);
};

const createJwt = (payload: object): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sanitizeUser = (user: {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

// ----------------------
// Signup
// ----------------------
export const signupUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    const sanitized = sanitizeUser(user);
    const token = createJwt({
      id: sanitized.id,
      role: sanitized.role,
      email: sanitized.email,
    });

    return res.status(201).json({
      token,
      user: sanitized,
    });
  } catch (error) {
    console.error("Error signing up user:", error);
    return res.status(500).json({ error: "Unable to create user" });
  }
};

// ----------------------
// Login
// ----------------------
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const sanitized = sanitizeUser(user);
    const token = createJwt({
      id: sanitized.id,
      role: sanitized.role,
      email: sanitized.email,
    });

    return res.status(200).json({
      token,
      user: sanitized,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Unable to log in" });
  }
};

// ----------------------
// Get Current User
// ----------------------
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const reqUser = (req as any).user;

    if (!reqUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: reqUser.id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ error: "Unable to fetch user" });
  }
};