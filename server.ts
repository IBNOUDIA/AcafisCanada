import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import {
  handleMentorRequest,
  handleContactRequest,
  handleMemberRegister,
  handleMemberLogin,
  handleMemberDocuments,
  handleMemberChildrenList,
  handleMemberChildAdd,
  handleMemberChildRemove,
} from "./src/server/handlers";
import { getClientIp } from "./src/server/requestIp";
import {
  handleAdminLogin,
  handleAdminChangePassword,
  handleAdminMembersList,
  handleAdminSetPaymentStatus,
  handleAdminFamilyStats,
  handleAdminDocumentsList,
  handleAdminDocumentAdd,
  handleAdminDocumentRemove,
} from "./src/server/adminHandlers";

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
  const result = await handleMentorRequest(req.body, getClientIp(req));
  res.status(result.status).json(result.body);
});

// Contact message endpoint
app.post("/api/contact", async (req, res) => {
  const result = await handleContactRequest(req.body, getClientIp(req));
  res.status(result.status).json(result.body);
});

// Membership registration endpoint
app.post("/api/members/register", async (req, res) => {
  const result = await handleMemberRegister(req.body, getClientIp(req));
  res.status(result.status).json(result.body);
});

// Member login endpoint
app.post("/api/auth/login", async (req, res) => {
  const result = await handleMemberLogin(req.body, getClientIp(req));
  res.status(result.status).json(result.body);
});

// Members-only documents endpoint
app.post("/api/members/documents", async (req, res) => {
  const result = await handleMemberDocuments(req.body, getClientIp(req));
  res.status(result.status).json(result.body);
});

// Family census (children under 18) endpoints
app.post("/api/members/children/list", async (req, res) => {
  const result = await handleMemberChildrenList(req.body, getClientIp(req));
  res.status(result.status).json(result.body);
});

app.post("/api/members/children/add", async (req, res) => {
  const result = await handleMemberChildAdd(req.body, getClientIp(req));
  res.status(result.status).json(result.body);
});

app.post("/api/members/children/remove", async (req, res) => {
  const result = await handleMemberChildRemove(req.body, getClientIp(req));
  res.status(result.status).json(result.body);
});

// Admin dashboard endpoints (Bureau Exécutif access)
app.post("/api/admin/login", async (req, res) => {
  const result = await handleAdminLogin(req.body, getClientIp(req));
  res.status(result.status).json(result.body);
});

app.post("/api/admin/change-password", async (req, res) => {
  const result = await handleAdminChangePassword(req.body);
  res.status(result.status).json(result.body);
});

app.post("/api/admin/members-list", async (req, res) => {
  const result = await handleAdminMembersList(req.body);
  res.status(result.status).json(result.body);
});

app.post("/api/admin/members-set-payment-status", async (req, res) => {
  const result = await handleAdminSetPaymentStatus(req.body);
  res.status(result.status).json(result.body);
});

app.post("/api/admin/family-stats", async (req, res) => {
  const result = await handleAdminFamilyStats(req.body);
  res.status(result.status).json(result.body);
});

app.post("/api/admin/documents-list", async (req, res) => {
  const result = await handleAdminDocumentsList(req.body);
  res.status(result.status).json(result.body);
});

app.post("/api/admin/documents-add", async (req, res) => {
  const result = await handleAdminDocumentAdd(req.body);
  res.status(result.status).json(result.body);
});

app.post("/api/admin/documents-remove", async (req, res) => {
  const result = await handleAdminDocumentRemove(req.body);
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
