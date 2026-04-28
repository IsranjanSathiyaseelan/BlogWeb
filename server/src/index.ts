import "dotenv/config";
import { app } from "./app";
import { checkDbConnection, initializeDb, pool } from "./config/db";

const port = Number(process.env.PORT) || 3000;

const startServer = async () => {
  const connected = await checkDbConnection();

  if (!connected) {
    console.error("Database not connected. Check your .env or PostgreSQL.");
    process.exit(1);
  }

  await initializeDb();

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  // graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\nShutting down...");
    await pool.end();
    process.exit(0);
  });
};

startServer();