import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

// Middleware Configuration
app.use(express.json({ limit: "10mb" })); // Increase payload limit to 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Handle URL-encoded data
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    credentials: true, // Include credentials (cookies, authorization headers)
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Start Server
server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB(); // Ensure database connection is established
});
