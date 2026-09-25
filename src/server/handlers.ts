/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";
import { getSupabaseClient } from "./supabaseClient.js";
import { checkRateLimit, RATE_LIMIT_ERROR } from "./rateLimit.js";
import { isValidEmail } from "./validation.js";

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

// TEMPORAIRE (en attendant l'achat et la verification du domaine acafis.ca) :
// sur decision du bureau, les deux formulaires sont routes vers le courriel du
// president Moustapha Sane le temps de la transition, avant de revenir aux
// adresses officielles ci-dessous une fois un domaine ACAFIS verifie sur
// resend.com/domains.
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "taphasane1910@gmail.com"; // officiel : secretariat@acafis.ca
const MEMBERSHIP_TO_EMAIL = process.env.MEMBERSHIP_TO_EMAIL || "taphasane1910@gmail.com"; // officiel : acafisfinance2@gmail.com
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
  // Optional document/image attachment for Kocc Barma to analyze (base64, no
  // "data:...;base64," prefix — stripped client-side by src/lib/fileToBase64.ts).
  fileData?: string;
  fileMimeType?: string;
  fileName?: string;
}

// Text-like documents are decoded and inlined as plain text in the prompt
// (simpler and more reliable than multimodal parts for .txt/.md/.csv).
// Anything else (images, PDF) is sent to Gemini as a native multimodal part.
const TEXT_LIKE_MIME_PREFIXES = ["text/"];
const MAX_INLINE_TEXT_CHARS = 20000;

export async function handleMentorRequest(
  body: MentorRequestBody,
  ip: string
): Promise<HandlerResult<{ reply?: string; error?: string }>> {
  const { message, topic = "general", fileData, fileMimeType, fileName } = body;

  if (!message || typeof message !== "string") {
    return { status: 400, body: { error: "Message requis" } };
  }

  // This is the one endpoint that calls a paid, metered API (Gemini) — the
  // tightest limit of all, since an unthrottled script here directly costs
  // ACAFIS money, unlike the other endpoints which only cost database rows.
  if (!(await checkRateLimit(ip, { bucket: "mentor", limit: 30, windowMinutes: 60 }))) {
    return { status: 429, body: { error: RATE_LIMIT_ERROR } };
  }

  const hasAttachment = !!fileData && !!fileMimeType;
  const isTextLikeAttachment = hasAttachment && TEXT_LIKE_MIME_PREFIXES.some((p) => fileMimeType!.startsWith(p));

  const topicPrompts: Record<string, string> = {
    culture: "Focus : Histoire, traditions, géographie, symboles et culture du Sénégal (Teranga, monuments, Gorée, Casamance, Ndianda, etc.).",
    maths: "Focus : Mathématiques et sciences du primaire au secondaire et au cégep. Explications pédagogiques étape par étape, claires et stimulantes.",
    code: "Focus : Codage et programmation (Python, Scratch, HTML/JS, algorithmique), robotique (Arduino, capteurs, électronique de base) et intelligence artificielle expliqués simplement.",
    orientation: "Focus : Orientation scolaire et professionnelle au Canada (cégeps, universités, métiers d'avenir), équivalences de diplômes pour les nouveaux arrivants, et bourses d'études disponibles pour la diaspora.",
    general: "Focus : Accompagnement bienveillant, méthode de travail, curiosité scientifique et fierté culturelle de la diaspora.",
  };

  const systemInstruction = `Tu es "Kocc Barma", l'agent IA éducatif officiel d'ACAFIS Canada (Association Communautaire d'Aide aux Familles Immigrantes Sénégalaises). Ton nom rend hommage à Kocc Barma Fall, le grand sage et philosophe sénégalais du royaume du Cayor, célèbre pour sa sagesse et ses proverbes éclairés.

Ton rôle est d'accompagner avec bienveillance les apprenants de la diaspora (jeunes et adultes) ainsi que leurs parents, dans leur parcours éducatif, académique et professionnel, au Canada comme au Sénégal — tout en étant capable de répondre à toute question sur ACAFIS Canada elle-même, ses services, sa boutique et sa coopérative.

LANGUES : tu es parfaitement trilingue — français, anglais et wolof. Détecte automatiquement la langue utilisée par la personne qui t'écrit et réponds TOUJOURS dans cette même langue. Si le message est ambigu ou mélange plusieurs langues, réponds en français par défaut et propose poliment de continuer en anglais ("I can also answer in English if you prefer") ou en wolof ("Man naa la tontu ci wolof itam, bu la neexee"). En wolof, exprime-toi de façon naturelle et authentique (salutations comme "Jàmm nga am", "Nanga def", proverbes courts et sages) ; pour les notions techniques pointues (code, sciences, démarches administratives), il est normal et authentique d'insérer des mots français/anglais au milieu du wolof (code-switching), comme le font naturellement les locuteurs wolof au quotidien — n'invente jamais un vocabulaire technique wolof qui n'existe pas.

Tu t'exprimes avec clarté, chaleur, enthousiasme et professionnalisme, avec une touche de sagesse et de Teranga sénégalaise — comme un mentor de confiance, jamais condescendant.

CAPACITÉS TECHNIQUES : (1) Tu peux lire et analyser un document ou une image que la personne t'envoie en pièce jointe (devoir photographié, PDF, relevé de notes, texte à corriger, etc.) — analyse-le avec soin et donne un retour concret et constructif. (2) Tu as accès à la recherche Google en temps réel : utilise-la pour toute question portant sur une actualité récente, une date précise, un fait qui peut avoir changé, ou un sujet hors de tes connaissances de base — et dans ce cas, indique brièvement que l'information vient d'une recherche en ligne.

Tu es polyvalent et compétent dans les domaines suivants :
1. Aide scolaire et académique (maths, sciences, français, méthodologie de travail) du primaire au cégep/université
2. Codage et programmation (Python, Scratch, HTML/JS, algorithmique, intelligence artificielle)
3. Robotique et nouvelles technologies (nTIC) : capteurs, Arduino, initiation à l'électronique
4. Orientation scolaire et professionnelle : choix de carrière, admissions au cégep/université, métiers d'avenir
5. Équivalences de diplômes et reconnaissance des acquis pour les nouveaux arrivants
6. Bourses d'études et aide financière pour les étudiants de la diaspora
7. Culture, histoire et patrimoine sénégalais (Teranga, Gorée, Casamance, Musée des Civilisations Noires, Cité Jardin Ndianda)

BASE DE CONNAISSANCES OFFICIELLE ACAFIS CANADA (faits réels — utilise-les pour répondre avec précision, ne les contredis jamais) :
• Identité : Association Communautaire d'Aide aux Familles Immigrantes Sénégalaises (ACAFIS Canada), organisme à but non lucratif au service de la diaspora sénégalaise, basé au Québec.
• Adresse : 4845, avenue de Courtrai, suite 101, Montréal, QC H3W 0A2, Canada. Numéro d'entreprise du Québec (NEQ) : 1167888842.
• Adhésion : cotisation annuelle de 25$ CAD, paiement par virement Interac à acafisfinance2@gmail.com (question secrète "Pays ?", réponse "Senegal"). Inscription via la page "Adhésion & Contact" du site.
• Contacts : secretariat@acafis.ca (secrétariat général) ; le Président Moustapha Sane est joignable à taphasane1910@gmail.com ou au +1 (514) 250-7209 ; le Secrétaire Général Ablaye Diatta est joignable à abdou.diatta9@gmail.com. IMPORTANT : chaque fois qu'on te demande comment contacter ACAFIS, le secrétariat, ou une personne précise du Bureau, cite TOUJOURS ses coordonnées directes complètes (nom + courriel/téléphone) en plus de l'adresse générique si pertinent — ne réponds jamais de façon vague ou incomplète à ce sujet.
• Bureau Exécutif (11 membres) : Moustapha Sane (Président), Omar Cisse (Adjoint/VP), Ablaye Diatta (Secrétaire Général), Adama Sow (Secrétaire Général Adjoint), Landiata Dieme (Trésorier Général), Pa Sonko (Trésorier Adjoint), Ibrahima Diop (Controller), Ibnou Amar Dia (Assistant Contrôle & Support), Mounirou Dieme (Président Commission Organisation), Ngoma Dhiediou (Présidente Commission Féminine), Sire Aw (Responsable Communication).
• Hommage aux anciens Présidents d'ACAFIS : Landiata Dieme, Ibrahima Diop, Omar Cisse, Ibnou Amar Dia, puis Moustapha Sane (actuel).
• Coop-ACAFIS (coopérative sœur, DISTINCTE d'ACAFIS Canada, site coop-acafis.com) : coopérative d'habitat de la diaspora sénégalaise au Canada, fondée en janvier 2014 à Montréal, agréée par l'État du Sénégal en 2018 (agrément interministériel N° 018485). Porte le projet "Cité-Jardin ACAFIS" à Ndianda (Commune de Nguéniène, Mbour, Sénégal — à ~1h30 de Dakar) : 320 logements modernes prévus sur environ 14 hectares (site principal Ndianda 10,5 ha + site secondaire Mbodiène 3,5 ha). Déjà 48 acquéreurs membres ; livraison des premières villas prévue en 2028, projet complet visé pour 2030. 6 types de villas (F3 à F6, terrain de 300 m² inclus) conçues par Studio SAAMS et construites par Ridwan Engineering, avec financement bancaire (BHS) sur 20 ans, de 87M FCFA (villa F3 rez-de-chaussée) à 225M FCFA (triplex prestige F6) + 5,5M FCFA de droit d'accès foncier. Cotisation 2026 : 100 000 FCFA ; parts sociales : 250 000 FCFA — CES MONTANTS EN FCFA SONT DISTINCTS de la cotisation annuelle de 25$ CAD d'ACAFIS Canada, ne jamais les confondre. Contact Coop-ACAFIS : WhatsApp +1 418 265 0499. Présidents : Omar Sarr, Souleymane Diallo, puis Omar Sarr de nouveau (actuel, depuis 2024). (Note : à ce jour, coop-acafis.com n'a pas d'agent IA — toi, Kocc Barma, es le seul assistant IA officiel des deux organisations.)
• Boutique officielle : boutique-acafis.vercel.app — produits ACAFIS/Coop-ACAFIS (t-shirts, casquettes, artisanat, etc.), dont les bénéfices financent les bourses jeunesse.
• Missions & Services (6 axes) : (1) Pont Solidaire Diaspora-Sénégal ; (2) ACAFIS Cité Jardin & Coop-ACAFIS (habitat à Ndianda) ; (3) Éducation, Soutien Scolaire & nTIC (dont toi, Kocc Barma) ; (4) Accueil & Intégration des nouveaux arrivants au Canada (parrainage, réseautage, entraide) ; (5) Acquisition d'un Centre Communautaire ACAFIS — un local qui sera à la fois centre de formation pour les jeunes et lieu d'accueil-conseil pour les nouveaux arrivants (projet en cours) ; (6) Culture, Rassemblements & Mémoire.
• Programme annuel : Hiver = AG Ordinaire & Journée ACAFIS (bilan, gouvernance) ; Printemps = Conférences sur l'investissement immobilier et l'entrepreneuriat ; Été = Grand BBQ familial & sorties plein air ; Automne = Gala de Solidarité (levée de fonds) ; Réveillon (31 décembre) = ACAFIS Célébration Fin d'Année, au Café le Cheval (5320 Chem. Queen Mary, Montréal, QC H3X 1T7) — le jeune qui atteint 18 ans cette année-là prononce un discours pour sa dernière année à recevoir un cadeau.
• Colonie de vacances "Racines & Avenir" (2027-2030) : projet en 3 phases pour envoyer des jeunes de la diaspora (10-17 ans) en immersion au Sénégal (tourisme mémoriel à Gorée, immersion à la Cité Jardin Ndianda, Tech Camp nTIC).
• Partenaires : Regroupement Général des Sénégalais du Canada (RGSC), Arrondissement de Côte-des-Neiges, Afroleck.
• Pages du site ACAFIS Canada : Accueil, Espace Jeune, Programme, Média, Missions & Services, Grands Projets, Acafis Mentor (toi), Bureau Exécutif, Témoignages, Adhésion & Contact.
• Page "Grands Projets" : regroupe les 6 grands chantiers de longue haleine d'ACAFIS avec leur feuille de route détaillée — (1) Acquisition d'un Centre Communautaire (4 étapes, toutes à initier : comité & cahier des charges, financement, repérage & acquisition, aménagement & ouverture) ; (2) Cité-Jardin ACAFIS & Coop-ACAFIS (3 phases : 2018-2024 terminé, 2025-2027 en cours, 2028-2030 à venir) ; (3) Colonie de Vacances Racines & Avenir (voir plus haut) ; (4) Mise sur pied d'une Équipe de Soccer Ados 13-17 ans (4 étapes, à initier) ; (5) Projet Culinaire ACAFIS — transmission des recettes traditionnelles, initié en 2025 et en cours de structuration ; (6) Foyer Socio-Culturel de Ndianda — futur espace commun à la Cité-Jardin pour activités socio-culturelles, distinct des logements (4 étapes, à initier). Oriente vers cette page si on te demande comment aider concrètement à réaliser un de ces projets.

RESSOURCES OFFICIELLES (Québec/Canada) POUR ORIENTATION, ÉQUIVALENCES ET BOURSES — cite-les par leur nom exact quand c'est pertinent, mais n'invente jamais un montant ou un délai précis (ces informations changent chaque année) : invite plutôt à vérifier sur le site officiel de l'organisme.
• MIFI (Ministère de l'Immigration, de la Francisation et de l'Intégration du Québec) : délivre l'Évaluation comparative des études effectuées hors du Québec, la référence pour faire reconnaître un diplôme étranger au Québec.
• Ministère de l'Éducation du Québec : gère les équivalences pour le primaire et le secondaire (Service des équivalences d'études).
• WES (World Education Services) : organisme d'évaluation de diplômes reconnu dans le reste du Canada.
• AFE (Aide financière aux études du Québec) : programme de prêts et bourses pour les études postsecondaires.
• FRQ (Fonds de recherche du Québec) : bourses d'excellence pour les études supérieures et la recherche.
• Les cégeps et universités québécoises ont chacun un bureau des étudiants internationaux offrant bourses d'accueil et accompagnement — oriente vers celui de l'établissement visé.

REPÈRES CULTURELS & HISTORIQUES SUR LE SÉNÉGAL (faits fiables à réutiliser pour enrichir tes réponses culturelles) :
• Dakar est la capitale du Sénégal, pays d'Afrique de l'Ouest indépendant depuis le 4 avril 1960.
• Léopold Sédar Senghor, premier président du Sénégal, fut aussi un poète majeur du mouvement de la Négritude.
• L'Île de Gorée, au large de Dakar, classée au patrimoine mondial de l'UNESCO, abrite la Maison des Esclaves, haut lieu de mémoire de la traite négrière.
• La Casamance, région verdoyante du sud du pays (autour de Ziguinchor), est réputée pour sa biodiversité et la culture du peuple Diola.
• Le Musée des Civilisations Noires a ouvert ses portes à Dakar en décembre 2018.
• Kocc Barma Fall, dont tu portes le nom, était un philosophe et sage wolof du XVIIe siècle à la cour du royaume du Cayor, célèbre pour ses maximes de sagesse populaire encore citées aujourd'hui.

CONSIGNES D'ORIENTATION : question sur l'adhésion/le paiement → oriente vers la page "Adhésion & Contact" ou acafisfinance2@gmail.com. Question sur la boutique → mentionne boutique-acafis.vercel.app. Question sur la coopérative/l'investissement à Ndianda → mentionne coop-acafis.com. Question administrative précise que tu ne peux pas trancher → oriente vers secretariat@acafis.ca.

${topicPrompts[topic] || topicPrompts.general}

Consignes de style : reste concis (150-250 mots max), structure avec des puces claires si pertinent, adapte ton niveau de langage à l'âge et au contexte de la question, et termine toujours par une question stimulante, un encouragement ou un petit défi pour garder l'échange vivant. Si une question dépasse ton champ de compétence (ex : conseil juridique ou médical précis), recommande poliment de consulter le secrétariat d'ACAFIS Canada ou un professionnel qualifié.`;

  try {
    const ai = getGeminiClient();
    if (ai) {
      // Text-like attachments (.txt, .md, .csv…) are simply decoded and folded
      // into the prompt text; images/PDFs are sent as a native multimodal part.
      let effectiveMessage = message;
      let contents: string | { role: "user"; parts: Array<Record<string, unknown>> } = message;

      if (hasAttachment && isTextLikeAttachment) {
        const decoded = Buffer.from(fileData!, "base64").toString("utf-8").slice(0, MAX_INLINE_TEXT_CHARS);
        effectiveMessage = `${message}\n\n[Document joint : "${fileName || "document.txt"}"]\n${decoded}`;
        contents = effectiveMessage;
      } else if (hasAttachment) {
        contents = {
          role: "user",
          parts: [{ text: message }, { inlineData: { mimeType: fileMimeType, data: fileData } }],
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          tools: [{ googleSearch: {} }],
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

  // Document/image analysis strictly requires the live Gemini connection — the
  // canned fallback branches below would otherwise silently ignore the file
  // and answer as if nothing was attached, which would be misleading.
  if (hasAttachment) {
    return {
      status: 200,
      body: {
        reply:
          "Je vois que tu as joint un document, mais je ne peux pas l'analyser pour l'instant (connexion IA indisponible). Réessaie dans un instant, ou décris-moi son contenu en quelques mots et je ferai de mon mieux pour t'aider !",
      },
    };
  }

  // Fallback intelligent responses if API key is not yet set (or the call failed).
  // Detected only heuristically here (no real NLU) — the full Gemini path above
  // does true trilingual understanding via the systemInstruction; this is just
  // a reasonable offline safety net in the 3 languages Kocc Barma supports.
  const lowerMessage = message.toLowerCase();
  const detectLanguage = (text: string): "fr" | "en" | "wo" => {
    const wolofMarkers = ["nanga def", "jàmm", "jamm nga", "naka mu", "dama", "waaw", "deedeet", "ndax", "sama xarit", "yow", "ana", "kocc barma ci wolof"];
    const englishMarkers = [" the ", " how ", " what ", " you ", " is ", " are ", "hello", "please", "thanks", "school", "scholarship", "homework"];
    const woScore = wolofMarkers.filter((m) => text.includes(m)).length;
    const enScore = englishMarkers.filter((m) => text.includes(m)).length;
    if (woScore > 0 && woScore >= enScore) return "wo";
    if (enScore > 0) return "en";
    return "fr";
  };
  const lang = detectLanguage(lowerMessage);

  let fallbackReply: string;
  if (lang === "wo") {
    fallbackReply =
      "Jàmm nga am ! Maa ngi ci Kocc Barma, sa dikkeel ci ACAFIS Canada. Bëgg naa la wax ci wolof, waaye ay laaj yu xóot (informatique, bourse, diplôma, ak i sàkkufeeñoo) dañuy gën a leer bu nu ci waxee ci français walla ci english. Bul ragal a laaj ma ci sa làkk bu neex, ma tontu la ak sama xam-xam ! ACAFIS Canada, coop-acafis.com ak boutique-acafis.vercel.app, moom itam sa mbokk lañu — bul ragal a wax ak nun. 🇸🇳";
  } else if (lang === "en") {
    fallbackReply = "Great question! I'm Kocc Barma, and I salute your curiosity. ";
    if (topic === "culture" || lowerMessage.includes("culture") || lowerMessage.includes("senegal")) {
      fallbackReply += "Senegal is famous for its Teranga (legendary hospitality) and rich heritage, from Gorée Island to the beautiful Casamance region. Did you know the Cité Jardin in Ndianda is an eco-friendly community project led by ACAFIS to reconnect the diaspora with its roots?";
    } else if (topic === "code" || lowerMessage.includes("code") || lowerMessage.includes("robot") || lowerMessage.includes(" ai ") || lowerMessage.includes("python")) {
      fallbackReply += "In programming and robotics, the key is breaking a problem into small logical steps (the algorithm). Python and Scratch are great for beginners to build mini-games, and a kit like Arduino lets you take your first steps in robotics. ACAFIS is even preparing nTIC workshops for the 2030 summer camp at the Cité Jardin!";
    } else if (topic === "maths" || lowerMessage.includes("math")) {
      fallbackReply += "Mastering math comes down to regular practice and understanding the basics. Share the exact question from your homework and we'll work through it together, step by step!";
    } else if (lowerMessage.includes("equivalence") || lowerMessage.includes("diploma") || lowerMessage.includes("scholarship")) {
      fallbackReply += "To have a foreign diploma recognized, you generally need to contact your province's Ministry of Education or the institution directly. For scholarships, several organizations support immigrant students — ask the ACAFIS secretariat (secretariat@acafis.ca) to be pointed to the right resources!";
    } else if (topic === "orientation" || lowerMessage.includes("orientation") || lowerMessage.includes("cegep") || lowerMessage.includes("university")) {
      fallbackReply += "Choosing a path starts with your interests, strengths, and the needs of the job market. Explore CEGEP and university programs, and tell me about your passions so we can find the careers of the future that truly fit you!";
    } else {
      fallbackReply += "ACAFIS Canada's mission is to give every young person the keys to excel in their studies here in Canada while staying connected to their Senegalese roots. Ask me about your courses, your projects, your orientation — or about ACAFIS itself, the Coop-ACAFIS (coop-acafis.com), or our official shop (boutique-acafis.vercel.app)!";
    }
  } else {
    fallbackReply = "Excellente question ! Je suis Kocc Barma, et je salue ta curiosité. ";
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
    } else if (lowerMessage.includes("boutique") || lowerMessage.includes("coop") || lowerMessage.includes("ndianda") || lowerMessage.includes("cité jardin") || lowerMessage.includes("cite jardin")) {
      fallbackReply += "La Coop-ACAFIS (coop-acafis.com) porte notre projet d'habitat solidaire Cité Jardin à Ndianda, au Sénégal. Et notre Boutique Officielle (boutique-acafis.vercel.app) propose des produits ACAFIS dont les bénéfices financent les bourses jeunesse. Qu'aimerais-tu savoir de plus ?";
    } else {
      fallbackReply += "Notre mission à ACAFIS Canada est de donner à chaque jeune les clés pour exceller dans ses études ici au Canada tout en restant connecté à ses racines sénégalaises. Pose-moi n'importe quelle question sur tes cours, tes projets, ton orientation — ou sur ACAFIS elle-même, la Coop-ACAFIS ou notre boutique officielle !";
    }
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
  data: ContactRequestBody,
  ip: string
): Promise<HandlerResult<Record<string, unknown>>> {
  const { name, email, phone, subject, message } = data;

  if (!name || !email || !message) {
    return { status: 400, body: { error: "Champs obligatoires manquants" } };
  }

  if (!isValidEmail(email)) {
    return { status: 400, body: { error: "Adresse courriel invalide" } };
  }

  if (!(await checkRateLimit(ip, { bucket: "contact", limit: 5, windowMinutes: 60 }))) {
    return { status: 429, body: { error: RATE_LIMIT_ERROR } };
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
  coopInterest?: boolean;
}

export async function handleMemberRegister(
  data: MemberRegisterBody,
  ip: string
): Promise<HandlerResult<Record<string, unknown>>> {
  const { firstName, lastName, email, phone, city, coopInterest } = data;

  if (!firstName || !lastName || !email) {
    return { status: 400, body: { error: "Prénom, nom et email sont requis" } };
  }

  if (!isValidEmail(email)) {
    return { status: 400, body: { error: "Adresse courriel invalide" } };
  }

  if (!(await checkRateLimit(ip, { bucket: "member-register", limit: 5, windowMinutes: 60 }))) {
    return { status: 429, body: { error: RATE_LIMIT_ERROR } };
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

  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("members").insert({
      member_id: member.memberId,
      first_name: member.firstName,
      last_name: member.lastName,
      email: member.email.toLowerCase(),
      phone: member.phone,
      city: member.city,
      membership_year: member.membershipYear,
      annual_fee: member.annualFee,
      issued_at: member.issuedAt,
      status: member.status,
      coop_interest: !!coopInterest,
    });
    if (error) {
      // A duplicate email is the one expected failure (a member registering
      // twice) — everything else is logged but shouldn't block the card from
      // being issued/emailed, since Supabase persistence is additive on top
      // of the existing email-notification flow.
      if (error.code === "23505") {
        return { status: 409, body: { error: "Un membre existe déjà avec ce courriel." } };
      }
      console.error("Supabase member insert failed:", error);
    }
  } else {
    console.log("[Membership Registration - SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY absent, membre non persisté]", member);
  }

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

// ---------------------------------------------------------------------------
// Member login (email + optional member number, checked against Supabase)
// ---------------------------------------------------------------------------

export interface MemberLoginBody {
  email?: string;
  memberId?: string;
}

const NOT_CONFIGURED_ERROR =
  "L'espace membre n'est pas encore configuré. Merci de contacter le secrétariat (secretariat@acafis.ca).";

function mapMemberRow(row: Record<string, any>): Record<string, unknown> {
  return {
    memberId: row.member_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    membershipYear: row.membership_year,
    annualFee: row.annual_fee,
    issuedAt: row.issued_at,
    status: row.status,
    paymentStatus: row.payment_status,
    coopInterest: row.coop_interest,
  };
}

// Shared by login and every members-only endpoint (documents, etc.): there is
// no real session/token system here, so each request re-proves identity with
// the same email (+ optional member number) pair the member logged in with.
async function verifyMember(
  email: string | undefined,
  memberId: string | undefined,
  ip: string
): Promise<HandlerResult<{ member?: Record<string, unknown>; error?: string }>> {
  if (!email || typeof email !== "string") {
    return { status: 400, body: { error: "Courriel requis" } };
  }

  if (!isValidEmail(email)) {
    return { status: 400, body: { error: "Adresse courriel invalide" } };
  }

  // Shared by login, documents, and every family-census endpoint — this is
  // the one check that gates access to a member's data, so it's the right
  // place to block a script trying many emails/member numbers.
  if (!(await checkRateLimit(ip, { bucket: "member-auth", limit: 30, windowMinutes: 60 }))) {
    return { status: 429, body: { error: RATE_LIMIT_ERROR } };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { status: 503, body: { error: NOT_CONFIGURED_ERROR } };
  }

  const { data: row, error } = await supabase
    .from("members")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  if (error) {
    console.error("Supabase member lookup failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  if (!row) {
    return { status: 401, body: { error: "Aucun membre trouvé avec ce courriel." } };
  }

  if (memberId && memberId.trim() && memberId.trim().toUpperCase() !== row.member_id.toUpperCase()) {
    return { status: 401, body: { error: "Numéro de membre ou mot de passe incorrect." } };
  }

  return { status: 200, body: { member: mapMemberRow(row) } };
}

export async function handleMemberLogin(
  data: MemberLoginBody,
  ip: string
): Promise<HandlerResult<{ member?: Record<string, unknown>; error?: string }>> {
  return verifyMember(data.email, data.memberId, ip);
}

// ---------------------------------------------------------------------------
// Members-only documents (AG minutes, annual financial reports...)
// ---------------------------------------------------------------------------

export interface MemberDocumentsBody {
  email?: string;
  memberId?: string;
}

export async function handleMemberDocuments(
  data: MemberDocumentsBody,
  ip: string
): Promise<HandlerResult<{ documents?: Record<string, unknown>[]; error?: string }>> {
  const verification = await verifyMember(data.email, data.memberId, ip);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.body.error } };
  }

  const supabase = getSupabaseClient()!; // verifyMember already returned 200, so this exists
  const { data: rows, error } = await supabase
    .from("member_documents")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Supabase member_documents lookup failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return {
    status: 200,
    body: {
      documents: (rows || []).map((row: Record<string, any>) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        fileUrl: row.file_url,
        publishedAt: row.published_at,
      })),
    },
  };
}

// ---------------------------------------------------------------------------
// Family census — children under 18 declared by a member (youth activity
// planning + accurate beneficiary count)
// ---------------------------------------------------------------------------

const CHILD_GENDERS = ["feminin", "masculin", "autre"] as const;
type ChildGender = (typeof CHILD_GENDERS)[number];

function mapChildRow(row: Record<string, any>): Record<string, unknown> {
  return {
    id: row.id,
    firstName: row.first_name,
    birthYear: row.birth_year,
    gender: row.gender,
  };
}

export interface MemberChildrenListBody {
  email?: string;
  memberId?: string;
}

export async function handleMemberChildrenList(
  data: MemberChildrenListBody,
  ip: string
): Promise<HandlerResult<{ children?: Record<string, unknown>[]; error?: string }>> {
  const verification = await verifyMember(data.email, data.memberId, ip);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.body.error } };
  }

  const memberRecord = verification.body.member!;
  const supabase = getSupabaseClient()!; // verifyMember already returned 200, so this exists
  const { data: rows, error } = await supabase
    .from("member_children")
    .select("*")
    .eq("member_id", memberRecord.memberId as string)
    .order("birth_year", { ascending: false });

  if (error) {
    console.error("Supabase member_children lookup failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return { status: 200, body: { children: (rows || []).map(mapChildRow) } };
}

export interface MemberChildAddBody {
  email?: string;
  memberId?: string;
  firstName?: string;
  birthYear?: number;
  gender?: string;
}

export async function handleMemberChildAdd(
  data: MemberChildAddBody,
  ip: string
): Promise<HandlerResult<{ child?: Record<string, unknown>; error?: string }>> {
  const verification = await verifyMember(data.email, data.memberId, ip);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.body.error } };
  }

  const { firstName, birthYear, gender } = data;
  const currentYear = new Date().getFullYear();

  if (!birthYear || !Number.isInteger(birthYear) || birthYear < currentYear - 17 || birthYear > currentYear) {
    return { status: 400, body: { error: "Année de naissance invalide (l'enfant doit avoir moins de 18 ans)." } };
  }
  if (!gender || !CHILD_GENDERS.includes(gender as ChildGender)) {
    return { status: 400, body: { error: "Genre invalide." } };
  }

  const memberRecord = verification.body.member!;
  const supabase = getSupabaseClient()!;
  const { data: row, error } = await supabase
    .from("member_children")
    .insert({
      member_id: memberRecord.memberId as string,
      first_name: firstName?.trim() || null,
      birth_year: birthYear,
      gender,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase member_children insert failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return { status: 200, body: { child: mapChildRow(row) } };
}

export interface MemberChildRemoveBody {
  email?: string;
  memberId?: string;
  childId?: string;
}

export async function handleMemberChildRemove(
  data: MemberChildRemoveBody,
  ip: string
): Promise<HandlerResult<{ success?: boolean; error?: string }>> {
  const verification = await verifyMember(data.email, data.memberId, ip);
  if (verification.status !== 200) {
    return { status: verification.status, body: { error: verification.body.error } };
  }

  if (!data.childId) {
    return { status: 400, body: { error: "Identifiant d'enfant requis" } };
  }

  const memberRecord = verification.body.member!;
  const supabase = getSupabaseClient()!;
  // Scoped to member_id so a member can only ever delete their own children.
  const { error } = await supabase
    .from("member_children")
    .delete()
    .eq("id", data.childId)
    .eq("member_id", memberRecord.memberId as string);

  if (error) {
    console.error("Supabase member_children delete failed:", error);
    return { status: 500, body: { error: "Erreur serveur, réessayez dans un instant." } };
  }

  return { status: 200, body: { success: true } };
}
