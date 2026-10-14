import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { environment } from "./config/environment.js";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import projectRoutes from "./routes/project.routes.js";
import qualificationRoutes from "./routes/qualification.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

export function createApp() {
  const app = express();

  // Security and parsing middleware must run before the API routes.
  app.use(helmet());
  app.use(cors({ origin: environment.clientOrigin, credentials: true }));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  if (environment.nodeEnv !== "test") {
    app.use(morgan("dev"));
  }

  app.get("/", (_request, response) => {
    response.json({ message: "Welcome to Zohaib Syed's Portfolio API." });
  });

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok", service: "portfolio-api" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/contacts", contactRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/qualifications", qualificationRoutes);
  app.use("/api/users", userRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
