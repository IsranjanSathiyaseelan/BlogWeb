import { Pool } from "pg";

// Create PostgreSQL pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test DB connection
export const checkDbConnection = async (): Promise<boolean> => {
  try {
    const result = await pool.query("SELECT 1");
    console.log("DB Connected:", result.rows);

    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
};