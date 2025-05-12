import https from "https";
import http from "http";
import fs from "fs";
import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts_routes";
import commentsRoutes from "./routes/comments_routes";
import authRoutes from "./routes/auth_routes";
import usersRoutes from "./routes/users_routes";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cookieParser from "cookie-parser";
import fileRoutes from "./routes/file_routes";
import searchRoutes from "./routes/search_routes";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:5173",

    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// API Routes
app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);
app.use("/auth", authRoutes);
app.use("/files", fileRoutes);
app.use("/user", usersRoutes); 
app.use("/search", searchRoutes);

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));


// Swagger Configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 3000}` },],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);

app.use("/public/", express.static("public"));
app.use("/storage/", express.static("storage"));
app.use("/", express.static("front"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

//  Initialize the application
async function initApp(): Promise<Express> {
  if (!process.env.DB_CONNECT) {
    throw new Error(" DB_CONNECT is not set");
  }
  
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log(" Connected to MongoDB");

    

    return app;
  } catch (error) {
    console.error(" MongoDB Connection Error:", error);
    throw error;
  }
}

export default initApp;
