import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import {
  handleMentorRequest,
  handleContactRequest,
  handleMemberRegister,
} from "./src/server/handlers";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mentor ACAFIS API endpoint
app.post("/api/mentor", async (req, res) => {
  const result = await handleMentorRequest(req.body);
  res.status(result.status).json(result.body);
});

// Contact message endpoint
app.post("/api/contact", async (req, res) => {
  const result = await handleContactRequest(req.body);
  res.status(result.status).json(result.body);
});

// Membership registration endpoint
app.post("/api/members/register", async (req, res) => {
  const result = await handleMemberRegister(req.body);
  res.status(result.status).json(result.body);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ACAFIS Canada server running on port ${PORT}`);
  });
}

startServer();
