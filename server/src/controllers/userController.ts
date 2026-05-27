import crypto from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // use env in real app

// ----------------------
// Helpers
// ----------------------

const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.randomBytes(16).toString("hex");

  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err);
      else resolve(key as Buffer);
    });
  });

  return `${salt}$${derived.toString("hex")}`;
};

const verifyPassword = async (
  password: string,
  storedHash: string
): Promise<boolean> => {
  const [salt, key] = storedHash.split("$");

  if (!salt || !key) return false;

  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err);
      else resolve(key as Buffer);
    });
  });

  const expected = Buffer.from(key, "hex");

  return crypto.timingSafeEqual(derived, expected);
};

const createJwt = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sanitizeUser = (row: any) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  createdAt:
    typeof row.created_at === "string"
      ? row.created_at
      : row.created_at?.toISOString() || null,
  updatedAt:
    typeof row.updated_at === "string"
      ? row.updated_at
      : row.updated_at?.toISOString() || null,
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

    const existing = await pool.query(
      `SELECT id FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );

    if ((existing.rowCount ?? 0) > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const passwordHash = await hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, passwordHash]
    );

    const user = sanitizeUser(result.rows[0]);
    const token = createJwt({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return res.status(201).json({
      token,
      user,
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

    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isValid = await verifyPassword(
      password,
      user.password_hash
    );

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createJwt({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return res.status(200).json({
      token,
      user: sanitizeUser(user),
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
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1 LIMIT 1`,
      [user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: sanitizeUser(result.rows[0]),
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ error: "Unable to fetch user" });
  }
};