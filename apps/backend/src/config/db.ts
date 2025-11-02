// src/db.ts
// import { PrismaClient } from "../generated/prisma";
import { drizzle } from "drizzle-orm/neon-http";
import { CONFIG } from ".";
import * as schema from "../db/index.js";
import { Database } from 'bun:sqlite'
// export type DBClient = PrismaClient | ReturnType<typeof drizzle>;
export type DBClient = ReturnType<typeof drizzle>;


export const createDBClient = (name: "prisma" | "drizzle" | "sqlite" = "prisma"): DBClient => {
  switch (name) {
    case "prisma":
    // return new PrismaClient();
    case "sqlite":
      const sqlite = new Database('./dev.db');
      return drizzle(sqlite, { schema });
    case "drizzle":
    default:
      return drizzle(CONFIG.DATABASE_URL, { schema });
  }
};
