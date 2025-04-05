import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Image schema with only necessary fields for the MVP
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalname: text("originalname").notNull(),
  mimetype: text("mimetype").notNull(),
  size: integer("size").notNull(),
  data: text("data").notNull(), // Base64 encoded image data for in-memory storage
  uploadDate: timestamp("upload_date").defaultNow().notNull(),
});

export const insertImageSchema = createInsertSchema(images).omit({ 
  id: true,
  uploadDate: true
});

export type InsertImage = z.infer<typeof insertImageSchema>;
export type Image = typeof images.$inferSelect;

// Schema for the frontend form validation
export const fileUploadSchema = z.object({
  files: z.array(
    z.instanceof(File).refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
      {
        message: 'Only JPEG, PNG, and GIF images are supported'
      }
    )
  ).min(1, 'Please select at least one image to upload')
});

export type FileUpload = z.infer<typeof fileUploadSchema>;
