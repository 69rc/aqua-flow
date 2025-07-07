import type { Express, RequestHandler } from "express";
import session from "express-session";
import { storage } from "./storage";

// Simple local authentication for development
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  return session({
    secret: process.env.SESSION_SECRET || "local-dev-secret-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for local development
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.use(getSession());

  // Simple login endpoint that assigns a demo user
  app.get("/api/login", async (req, res) => {
    // For local development, automatically log in as admin user
    const adminUser = await storage.getUser("admin-001");
    if (adminUser) {
      (req.session as any).user = {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
      };
      res.redirect("/");
    } else {
      res.status(500).json({ message: "Admin user not found. Please run the seed script." });
    }
  });

  // Logout endpoint
  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

  // Switch user endpoint for testing different roles
  app.post("/api/switch-user", async (req, res) => {
    const { userId } = req.body;
    const user = await storage.getUser(userId);
    
    if (user) {
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      res.json({ message: "User switched successfully", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = (req.session as any)?.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Attach user to request for easy access
  (req as any).user = user;
  return next();
};