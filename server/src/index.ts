import "dotenv/config";
import { app } from "./app";
import { prisma } from "./config/prisma";
import { port } from "./config/env";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.error("Database not connected. Check your DATABASE_URL:", error);
    process.exit(1);
  }

  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}, shutting down...`);
    server.close();
    await prisma.$disconnect();
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
