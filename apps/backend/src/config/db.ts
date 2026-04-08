// src/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as sqliteDrizzle } from "drizzle-orm/bun-sqlite";
import { Database } from 'bun:sqlite';
import { CONFIG } from ".";
import * as schema from "../db/index.js";
import * as sqliteSchema from "../db/sqlite-schema.js";

export type DBClient = ReturnType<typeof drizzle>;

export const createDBClient = (name: "drizzle" | "sqlite" = "drizzle"): any => {
  switch (name) {
    case "sqlite": {
      const sqlite = new Database('./dev.db');
      return sqliteDrizzle(sqlite, { schema: sqliteSchema });
    }
    case "drizzle":
    default:
      return drizzle(CONFIG.DATABASE_URL!, { schema });
  }
};
