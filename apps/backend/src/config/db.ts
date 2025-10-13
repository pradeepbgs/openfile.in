// src/db.ts
import { PrismaClient } from "../generated/prisma";
import { drizzle } from "drizzle-orm/neon-http";
import { CONFIG } from ".";

export type DBClient = PrismaClient | ReturnType<typeof drizzle>;

export const createDBClient = (name: "prisma" | "drizzle" = "prisma"): DBClient => {
  switch (name) {
    case "prisma":
      return new PrismaClient();
    case "drizzle":
    default:
      return drizzle(CONFIG.DATABASE_URL);
  }
};
