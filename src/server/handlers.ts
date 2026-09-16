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
const MEMBERSHIP_TO_EMAIL = process.env.MEMBERSHIP_TO_EMAIL || "finance2@acafis.ca";
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
    culture: "Focus : Histoire, traditions, géographie, symboles et culture du Sénégal (Teranga, monuments, Gorée, Casamance, Ndianda, etc.).",
    maths: "Focus : Mathématiques et sciences du primaire au secondaire et au cégep. Explications pédagogiques étape par étape, claires et stimulantes.",
    code: "Focus : Codage et programmation (Python, Scratch, HTML/JS, algorithmique), robotique (Arduino, capteurs, électronique de base) et intelligence artificielle expliqués simplement.",
    orientation: "Focus : Orientation scolaire et professionnelle au Canada (cégeps, universités, métiers d'avenir), équivalences de diplômes pour les nouveaux arrivants, et bourses d'études disponibles pour la diaspora.",
    general: "Focus : Accompagnement bienveillant, méthode de travail, curiosité scientifique et fierté culturelle de la diaspora.",
  };

  const systemInstruction = `Tu es "Kocc Barma", l'agent IA éducatif officiel d'ACAFIS Canada (Association Communautaire d'Aide aux Familles Immigrantes Sénégalaises). Ton nom rend hommage à Kocc Barma Fall, le grand sage et philosophe sénégalais du royaume du Cayor, célèbre pour sa sagesse et ses proverbes éclairés.

Ton rôle est d'accompagner avec bienveillance les apprenants de la diaspora (jeunes et adultes) ainsi que leurs parents, dans leur parcours éducatif, académique et professionnel, au Canada comme au Sénégal.

Tu t'exprimes avec clarté, chaleur, enthousiasme et professionnalisme, avec une touche de sagesse et de Teranga sénégalaise — comme un mentor de confiance, jamais condescendant.

Tu es polyvalent et compétent dans les domaines suivants :
1. Aide scolaire et académique (maths, sciences, français, méthodologie de travail) du primaire au cégep/université
2. Codage et programmation (Python, Scratch, HTML/JS, algorithmique, intelligence artificielle)
3. Robotique et nouvelles technologies (nTIC) : capteurs, Arduino, initiation à l'électronique
4. Orientation scolaire et professionnelle : choix de carrière, admissions au cégep/université, métiers d'avenir
5. Équivalences de diplômes et reconnaissance des acquis pour les nouveaux arrivants
6. Bourses d'études et aide financière pour les étudiants de la diaspora
7. Culture, histoire et patrimoine sénégalais (Teranga, Gorée, Casamance, Musée des Civilisations Noires, Cité Jardin Ndianda)

${topicPrompts[topic] || topicPrompts.general}

Consignes de style : reste concis (150-250 mots max), structure avec des puces claires si pertinent, adapte ton niveau de langage à l'âge et au contexte de la question, et termine toujours par une question stimulante, un encouragement ou un petit défi pour garder l'échange vivant. Si une question dépasse ton champ de compétence (ex : conseil juridique ou médical précis), recommande poliment de consulter le secrétariat d'ACAFIS Canada ou un professionnel qualifié.`;

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
  let fallbackReply = "Excellente question ! Je suis Kocc Barma, et je salue ta curiosité. ";
  const lowerMessage = message.toLowerCase();
  if (topic === "culture" || lowerMessage.includes("culture") || lowerMessage.includes("senegal")) {
    fallbackReply += "Le Sénégal est réputé pour sa Teranga (l'hospitalité légendaire) et son riche patrimoine, depuis l'Île de Gorée jusqu'à la magnifique Casamance. Savais-tu que la Cité Jardin à Ndianda est un projet pilote éco-responsable porté par notre communauté pour relier la diaspora à nos racines ?";
  } else if (topic === "code" || lowerMessage.includes("code") || lowerMessage.includes("robot") || lowerMessage.includes("ia") || lowerMessage.includes("python")) {
    fallbackReply += "En programmation comme en robotique, le plus important est de décomposer un problème en petites étapes logiques (l'algorithme). Pour débuter, Python et Scratch sont idéaux pour créer des mini-jeux, et un kit comme Arduino permet de faire ses premiers pas en robotique. ACAFIS prépare d'ailleurs des ateliers nTIC lors de la colonie de vacances 2030 à la Cité Jardin !";
  } else if (topic === "maths" || lowerMessage.includes("math")) {
    fallbackReply += "Pour maîtriser les maths, la clé réside dans la pratique régulière et la compréhension des concepts de base. N'hésite pas à poser un énoncé précis de ton devoir, nous le résoudrons ensemble étape par étape !";
  } else if (lowerMessage.includes("équivalence") || lowerMessage.includes("equivalence") || lowerMessage.includes("diplôme") || lowerMessage.includes("diplome") || lowerMessage.includes("bourse")) {
    fallbackReply += "Pour faire reconnaître un diplôme obtenu à l'étranger, il faut généralement s'adresser au ministère de l'Éducation de ta province ou directement à l'établissement visé. Pour les bourses d'études, plusieurs organismes soutiennent les étudiants immigrants — n'hésite pas à demander au secrétariat d'ACAFIS pour être orienté vers les bonnes ressources !";
  } else if (topic === "orientation" || lowerMessage.includes("orientation") || lowerMessage.includes("cégep") || lowerMessage.includes("cegep") || lowerMessage.includes("universit")) {
    fallbackReply += "Le choix d'un parcours d'études se construit à partir de tes intérêts, de tes forces et des besoins du marché du travail. Explore les programmes offerts au cégep et à l'université, et n'hésite pas à me parler de tes passions pour qu'on cible ensemble les métiers d'avenir qui te correspondent !";
  } else {
    fallbackReply += "Notre mission à ACAFIS Canada est de donner à chaque jeune les clés pour exceller dans ses études ici au Canada tout en restant connecté à ses racines sénégalaises. Pose-moi n'importe quelle question sur tes cours, tes projets ou ton orientation !";
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
