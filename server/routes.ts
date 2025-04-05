import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ZodError } from "zod";
import { insertImageSchema } from "@shared/schema";
import { generateAIResponse, generateWelcomeMessage } from './services/aiService';

// Define the extended Request type with files property
interface MulterRequest extends Request {
  files?: any; // This type is more permissive to avoid TypeScript errors with multer
}

// Memory storage for Multer
const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept only image files
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error("Only images (JPEG, PNG, GIF) are allowed"));
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all images
  app.get("/api/images", async (req: Request, res: Response) => {
    try {
      const images = await storage.getAllImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  // Get a single image by ID
  app.get("/api/images/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }

      const image = await storage.getImage(id);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.json(image);
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ message: "Failed to fetch image" });
    }
  });
  
  // Serve an image directly by ID (binary data)
  app.get("/images/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }

      const image = await storage.getImage(id);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      if (!image.data) {
        return res.status(404).json({ message: "Image data not found" });
      }

      const buffer = Buffer.from(image.data, 'base64');
      res.set('Content-Type', image.mimetype);
      res.set('Content-Disposition', `inline; filename="${image.filename}"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error serving image:", error);
      res.status(500).json({ message: "Failed to serve image" });
    }
  });

  // Upload one or multiple images
  app.post("/api/images/upload", upload.array("files", 10), async (req: MulterRequest, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "No files were uploaded" });
      }

      const uploadedImages = [];

      for (const file of req.files) {
        // Convert file buffer to base64 for in-memory storage
        const base64Data = file.buffer.toString('base64');
        
        try {
          // Create an image record
          const imageData = {
            filename: file.originalname.replace(/\s+/g, '_').toLowerCase(),
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            data: base64Data,
          };

          // Validate image data with Zod schema
          const validatedData = insertImageSchema.parse(imageData);
          
          // Save to storage
          const savedImage = await storage.createImage(validatedData);
          
          // Don't send the base64 data back in the response
          const { data, ...imageWithoutData } = savedImage;
          uploadedImages.push(imageWithoutData);
        } catch (err) {
          if (err instanceof ZodError) {
            console.error("Validation error:", err.errors);
            return res.status(400).json({ 
              message: "Invalid image data", 
              errors: err.errors
            });
          }
          throw err;
        }
      }

      res.status(201).json({
        message: `Successfully uploaded ${uploadedImages.length} image(s)`,
        images: uploadedImages
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ 
        message: "Failed to upload images",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete an image
  app.delete("/api/images/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }

      const image = await storage.getImage(id);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      const deleted = await storage.deleteImage(id);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete image" });
      }

      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  // AI Assistant endpoints
  
  // Get an AI response to a user's query
  app.post("/api/ai/query", express.json(), async (req: Request, res: Response) => {
    try {
      const { query, includeImage = false } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query is required and must be a string" });
      }
      
      const aiResponse = await generateAIResponse(query, includeImage);
      res.json(aiResponse);
    } catch (error) {
      console.error("Error getting AI response:", error);
      res.status(500).json({ 
        message: "Failed to get AI response",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get the welcome message with avatar
  app.get("/api/ai/welcome", async (_req: Request, res: Response) => {
    try {
      const welcomeMessage = await generateWelcomeMessage();
      res.json(welcomeMessage);
    } catch (error) {
      console.error("Error getting welcome message:", error);
      res.status(500).json({ 
        message: "Failed to get welcome message",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
