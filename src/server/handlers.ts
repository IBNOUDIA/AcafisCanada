/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";

// Lazy Gemini client initialization
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
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

// Lazy Resend client initialization
let resendClient: Resend | null = null;
function getResendClient(): Resend | null {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "secretariat@acafis.ca";
const MEMBERSHIP_TO_EMAIL = process.env.MEMBERSHIP_TO_EMAIL || "finance@acafis.ca";
const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "ACAFIS Canada <onboarding@resend.dev>";

interface HandlerResult<T> {
  status: number;
  body: T;
}

// ---------------------------------------------------------------------------
// Mentor ACAFIS (Gemini)
// ---------------------------------------------------------------------------

export interface MentorRequestBody {
  message?: string;
  topic?: string;
}

export async function handleMentorRequest(
  body: MentorRequestBody
): Promise<HandlerResult<{ reply?: string; error?: string }>> {
  const { message, topic = "general" } = body;

  if (!message || typeof message !== "string") {
    return { status: 400, body: { error: "Message requis" } };
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

      return {
        status: 200,
        body: { reply: response.text || "Bonjour ! Comment puis-je t'aider aujourd'hui ?" },
      };
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
  }

  // Fallback intelligent responses if API key is not yet set (or the call failed)
  let fallbackReply = "Excellente question ! En tant que Mentor ACAFIS, je te félicite pour ta curiosité. ";
  const lowerMessage = message.toLowerCase();
  if (topic === "culture" || lowerMessage.includes("culture") || lowerMessage.includes("senegal")) {
    fallbackReply += "Le Sénégal est réputé pour sa Teranga (l'hospitalité légendaire) et son riche patrimoine, depuis l'Île de Gorée jusqu'à la magnifique Casamance. Savais-tu que la Cité Jardin à Ndianda est un projet pilote éco-responsable porté par notre communauté pour relier la diaspora à nos racines ?";
  } else if (topic === "code" || lowerMessage.includes("code") || lowerMessage.includes("ia") || lowerMessage.includes("python")) {
    fallbackReply += "En programmation, le plus important est de décomposer un problème en petites étapes logiques (l'algorithme). Pour débuter, Python et Scratch sont idéaux pour créer des mini-jeux ou automatiser des tâches. ACAFIS prépare d'ailleurs des ateliers nTIC lors de la colonie de vacances 2027 à la Cité Jardin !";
  } else if (topic === "maths" || lowerMessage.includes("math")) {
    fallbackReply += "Pour maîtriser les maths, la clé réside dans la pratique régulière et la compréhension des concepts de base. N'hésite pas à poser un énoncé précis de ton devoir, nous le résoudrons ensemble étape par étape !";
  } else {
    fallbackReply += "Notre mission à ACAFIS Canada est de donner à chaque jeune les clés pour exceller dans ses études ici au Canada tout en restant connecté à ses racines sénégalaises. Pose-moi n'importe quelle question sur tes cours ou tes projets !";
  }

  return { status: 200, body: { reply: fallbackReply } };
}

// ---------------------------------------------------------------------------
// Contact form (email notification via Resend)
// ---------------------------------------------------------------------------

export interface ContactRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export async function handleContactRequest(
  data: ContactRequestBody
): Promise<HandlerResult<Record<string, unknown>>> {
  const { name, email, phone, subject, message } = data;

  if (!name || !email || !message) {
    return { status: 400, body: { error: "Champs obligatoires manquants" } };
  }

  const resend = getResendClient();
  if (resend) {
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: CONTACT_TO_EMAIL,
        replyTo: email,
        subject: `[ACAFIS Contact] ${subject || "Nouveau message"} — ${name}`,
        text: [
          `Nom : ${name}`,
          `Email : ${email}`,
          `Téléphone : ${phone || "Non renseigné"}`,
          `Objet : ${subject || "Non précisé"}`,
          "",
          "Message :",
          message,
        ].join("\n"),
      });
    } catch (error) {
      console.error("Resend contact email failed:", error);
    }
  } else {
    console.log(`[Contact Form Received - RESEND_API_KEY absent, aucun email envoyé] From: ${name} <${email}>, Subject: ${subject}`);
  }

  return {
    status: 200,
    body: {
      success: true,
      message: "Votre message a été transmis avec succès au secrétariat d'ACAFIS Canada.",
      receivedAt: new Date().toISOString(),
    },
  };
}

// ---------------------------------------------------------------------------
// Membership registration (email notification via Resend)
// ---------------------------------------------------------------------------

export interface MemberRegisterBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
}

export async function handleMemberRegister(
  data: MemberRegisterBody
): Promise<HandlerResult<Record<string, unknown>>> {
  const { firstName, lastName, email, phone, city } = data;

  if (!firstName || !lastName || !email) {
    return { status: 400, body: { error: "Prénom, nom et email sont requis" } };
  }

  const memberId = `ACAFIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const member = {
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
  };

  const resend = getResendClient();
  if (resend) {
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: MEMBERSHIP_TO_EMAIL,
        replyTo: email,
        subject: `[ACAFIS Adhésion] Nouvelle inscription — ${firstName} ${lastName}`,
        text: [
          "Nouvelle demande d'adhésion ACAFIS Canada :",
          "",
          `ID Membre : ${member.memberId}`,
          `Nom : ${firstName} ${lastName}`,
          `Email : ${email}`,
          `Téléphone : ${member.phone}`,
          `Ville : ${member.city}`,
          `Cotisation attendue : ${member.annualFee}`,
        ].join("\n"),
      });
    } catch (error) {
      console.error("Resend membership email failed:", error);
    }
  } else {
    console.log("[Membership Registration - RESEND_API_KEY absent, aucun email envoyé]", member);
  }

  return { status: 200, body: { success: true, member } };
}
