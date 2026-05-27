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

  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}, shutting down...`);
    await pool.end();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("unhandledRejection", async (reason) => {
    console.error("Unhandled rejection:", reason);
    await shutdown("unhandledRejection");
  });
};

startServer();