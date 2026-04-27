import { Pool } from "pg";

// PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Check DB connection
export const checkDbConnection = async (): Promise<boolean> => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected");
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
};

// Initialize database (tables + relations)
export const initializeDb = async (): Promise<void> => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'READER',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Blog posts table (with relation)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT NOT NULL,

        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

        published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),

        read_minutes INTEGER NOT NULL,
        category TEXT NOT NULL,
        featured BOOLEAN NOT NULL DEFAULT false
      );
    `);

    // Indexes (performance)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_author ON blog_posts(author_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published_at);
    `);

    console.log("Database initialized");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};