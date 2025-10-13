// src/schema.ts
import { pgTable, serial, varchar, text, integer, boolean, bigint, timestamp, json, doublePrecision, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const subscriptionStatus = pgEnum("SubscriptionStatus", ["ACTIVE", "INACTIVE", "CANCELLED"]);
export const deletedStatus = pgEnum("DeletedStatus", ["PENDING", "DELETED", "FAILED"]);

// Users table
export const users = pgTable("User", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 255 }).notNull(),
  linkCount: integer("linkCount").default(0).notNull(),
  linkCountExpireAt: timestamp("linkCountExpireAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  links: many(links),
  files: many(files),
  subscription: one(subscriptions, { fields: [users.id], references: [subscriptions.userId] }),
}));

// Links table
export const links = pgTable(
  "Link",
  {
    id: serial("id").primaryKey(),
    token: varchar("token", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).default(""),
    maxUploads: integer("maxUploads").notNull(),
    uploadCount: integer("uploadCount").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    expireAfterFirstUpload: boolean("expireAfterFirstUpload").default(false).notNull(),
    userId: integer("userId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
);

export const linksRelations = relations(links, ({ one, many }) => ({
  user: one(users, { fields: [links.userId], references: [users.id] }),
  files: many(files),
}));

// Files table
export const files = pgTable(
  "File",
  {
    id: serial("id").primaryKey(),
    url: text("url").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    size: bigint("size", { mode: "bigint" }).notNull(),
    keyUsed: boolean("keyUsed").default(false).notNull(),
    uploadLinkId: integer("uploadLinkId").notNull(),
    userId: integer("userId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
);

export const filesRelations = relations(files, ({ one }) => ({
  uploadLink: one(links, { fields: [files.uploadLinkId], references: [links.id] }),
  user: one(users, { fields: [files.userId], references: [users.id] }),
}));

// Subscriptions table
export const subscriptions = pgTable(
  "Subscription",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId").unique().notNull(),
    planName: varchar("planName", { length: 255 }).default("free").notNull(),
    price: doublePrecision("price").default(0.0).notNull(),
    status: subscriptionStatus("status").default("ACTIVE"),
    startDate: timestamp("startDate").defaultNow().notNull(),
    endDate: timestamp("endDate"),
    cancelAt: timestamp("cancelAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

// DeletedFiles table
export const deletedFiles = pgTable(
  "DeletedFile",
  {
    id: serial("id").primaryKey(),
    fileId: integer("fileId").notNull(),
    linkId: integer("linkId").notNull(),
    fileUrl: text("fileUrl").notNull(),
    status: deletedStatus("status").default("PENDING").notNull(),
    deletedAt: timestamp("deletedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
);

// SubscriptionLogs table
export const subscriptionLogs = pgTable(
  "SubscriptionLog",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    eventType: varchar("eventType", { length: 255 }).notNull(),
    status: varchar("status", { length: 255 }).notNull(),
    userEmail: varchar("userEmail", { length: 255 }).notNull(),
    userId: integer("userId"),
    paymentId: varchar("paymentId", { length: 255 }).unique().notNull(),
    subscriptionId: varchar("subscriptionId", { length: 255 }),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 10 }).notNull(),
    rawPayload: json("rawPayload").notNull(),
    message: text("message").notNull(),
    error: text("error"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
);

export const subscriptionLogsRelations = relations(subscriptionLogs, ({ one }) => ({
  user: one(users, { fields: [subscriptionLogs.userId], references: [users.id] }),
}));
