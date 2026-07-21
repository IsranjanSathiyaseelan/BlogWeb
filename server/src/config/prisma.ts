import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { databaseUrl } from "./env";

// Prisma 7's "prisma-client" generator requires an explicit driver adapter.
// We reuse the same postgres connection info that used to live in db.ts.
const adapter = new PrismaPg({ connectionString: databaseUrl });

export const prisma = new PrismaClient({ adapter });
