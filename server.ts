import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini client initialization
let genAI: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mentor ACAFIS API endpoint
app.post("/api/mentor", async (req, res) => {
  const { message, topic = "general" } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Message requis" });
    return;
  }

  const topicPrompts: Record<string, string> = {
    culture: "Focus: Histoire, traditions, géographie, symboles et culture du Sénégal (Teranga, monuments, Gorée, Casamance, Ndianda, etc.).",
    maths: "Focus: Mathématiques et sciences du primaire au secondaire. Explications pédagogiques étape par étape, claires et stimulantes.",
    code: "Focus: Initiation à l'informatique, programmation (Python, Scratch, HTML/JS, Algorithmique) et intelligence artificielle expliquée aux jeunes.",
    orientation: "Focus: Orientation scolaire et parcours d'études au Canada (cégeps, universités, carrières d'avenir, bourses) et passerelles vers le Sénégal.",
    general: "Focus: Accompagnement bienveillant, méthode de travail, curiosité scientifique et fierté culturelle de la diaspora.",
  };

  const systemInstruction = `Tu es "Le Mentor ACAFIS", l'assistant d'apprentissage virtuel d'ACAFIS Canada (Association des Ressortissants et Amis de la Casamance et du Sénégal au Canada).
Ton rôle est d'encourager, d'inspirer et d'instruire les jeunes de la diaspora (10-25 ans) ainsi que les parents.
Tu t'exprimes avec bienveillance, clarté, enthousiasme et une touche chaleureuse de Teranga sénégalaise.
Tu es compétent en :
1. Quiz Culture Sénégal & mémoire (Gorée, Musée des Civilisations Noires, Cité Jardin Ndianda)
2. Aide aux devoirs (Maths, Sciences, Français)
3. Initiation au Code & aux nouvelles technologies (nTIC & IA)
4. Orientation scolaire et académique au Canada.
${topicPrompts[topic] || topicPrompts.general}
Reste concis (150-250 mots max), engageant, structure avec des puces claires si pertinent et termine par une question stimulante ou un défi amical.`;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ reply: response.text || "Bonjour ! Comment puis-je t'aider aujourd'hui ?" });
      return;
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
  }

  // Fallback intelligent responses if API key is not yet set
  let fallbackReply = "Excellente question ! En tant que Mentor ACAFIS, je te félicite pour ta curiosité. ";
  if (topic === "culture" || message.toLowerCase().includes("culture") || message.toLowerCase().includes("senegal")) {
    fallbackReply += "Le Sénégal est réputé pour sa Teranga (l'hospitalité légendaire) et son riche patrimoine, depuis l'Île de Gorée jusqu'à la magnifique Casamance. Savais-tu que la Cité Jardin à Ndianda est un projet pilote éco-responsable porté par notre communauté pour relier la diaspora à nos racines ?";
  } else if (topic === "code" || message.toLowerCase().includes("code") || message.toLowerCase().includes("ia") || message.toLowerCase().includes("python")) {
    fallbackReply += "En programmation, le plus important est de décomposer un problème en petites étapes logiques (l'algorithme). Pour débuter, Python et Scratch sont idéaux pour créer des mini-jeux ou automatiser des tâches. ACAFIS prépare d'ailleurs des ateliers nTIC lors de la colonie de vacances 2027 à la Cité Jardin !";
  } else if (topic === "maths" || message.toLowerCase().includes("math")) {
    fallbackReply += "Pour maîtriser les maths, la clé réside dans la pratique régulière et la compréhension des concepts de base. N'hésite pas à poser un énoncé précis de ton devoir, nous le résoudrons ensemble étape par étape !";
  } else {
    fallbackReply += "Notre mission à ACAFIS Canada est de donner à chaque jeune les clés pour exceller dans ses études ici au Canada tout en restant connecté à ses racines sénégalaises. Pose-moi n'importe quelle question sur tes cours ou tes projets !";
  }

  res.json({ reply: fallbackReply });
});

// Contact message endpoint
app.post("/api/contact", (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: "Champs obligatoires manquants" });
    return;
  }
  // Log receipt for demo/mock persistence
  console.log(`[Contact Form Received] From: ${name} <${email}>, Subject: ${subject}`);
  res.json({
    success: true,
    message: "Votre message a été transmis avec succès au secrétariat d'ACAFIS Canada.",
    receivedAt: new Date().toISOString(),
  });
});

// Membership registration endpoint
app.post("/api/members/register", (req, res) => {
  const { firstName, lastName, email, phone, city } = req.body;
  if (!firstName || !lastName || !email) {
    res.status(400).json({ error: "Prénom, nom et email sont requis" });
    return;
  }

  const memberId = `ACAFIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  res.json({
    success: true,
    member: {
      memberId,
      firstName,
      lastName,
      email,
      phone: phone || "Non renseigné",
      city: city || "Canada",
      membershipYear: new Date().getFullYear(),
      annualFee: "25 CAD",
      issuedAt: new Date().toLocaleDateString("fr-CA"),
      status: "Validé (Attente cotisation)",
    },
  });
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
