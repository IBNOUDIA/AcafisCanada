import { Localized } from "../types";

const L = (fr: string, en: string): Localized => ({ fr, en });
const LP = (fr: string[], en: string[]): Localized<string[]> => ({ fr, en });

// Kept separate from acafisData.ts since this is legal/compliance content
// (Quebec Law 25) reviewed and approved on its own track by the Bureau
// Exécutif, not day-to-day site copy.
export const PRIVACY_POLICY_LAST_UPDATED = "2026-09-25";

export const PRIVACY_OFFICER = {
  name: "Moustapha Sane",
  title: L("Président, ACAFIS Canada — Responsable de la protection des renseignements personnels", "President, ACAFIS Canada — Privacy Officer"),
  email: "taphasane1910@gmail.com",
  phone: "+1 (514) 250-7209",
};

export interface PrivacyPolicySection {
  id: string;
  title: Localized;
  paragraphs: Localized<string[]>;
}

export const PRIVACY_POLICY_SECTIONS: PrivacyPolicySection[] = [
  {
    id: "engagement",
    title: L("Notre engagement", "Our commitment"),
    paragraphs: LP(
      [
        "ACAFIS Canada (Association Communautaire d'Aide aux Familles Immigrantes Sénégalaises), organisme à but non lucratif immatriculé au Registre des entreprises du Québec (NEQ 1167888842), accorde une grande importance à la protection des renseignements personnels de ses membres, de leurs familles et des visiteurs de son site.",
        "Cette politique explique, en langage simple, quels renseignements nous recueillons, pourquoi, et comment ils sont protégés, conformément à la Loi sur la protection des renseignements personnels dans le secteur privé du Québec (communément appelée « Loi 25 »).",
      ],
      [
        "ACAFIS Canada (Association Communautaire d'Aide aux Familles Immigrantes Sénégalaises), a non-profit organization registered with the Quebec Enterprise Registrar (NEQ 1167888842), places great importance on protecting the personal information of its members, their families, and visitors to its site.",
        "This policy explains, in plain language, what information we collect, why, and how it is protected, in accordance with Quebec's Act respecting the protection of personal information in the private sector (commonly known as \"Law 25\").",
      ]
    ),
  },
  {
    id: "collecte",
    title: L("Renseignements que nous recueillons", "Information we collect"),
    paragraphs: LP(
      [
        "Selon votre interaction avec le site, nous pouvons recueillir :",
        "• Lors de l'adhésion : prénom, nom, courriel, téléphone, ville, année d'adhésion et statut de cotisation.",
        "• Lors du recensement familial (facultatif) : prénom (facultatif), année de naissance et genre des enfants de moins de 18 ans d'un membre, saisis par le parent ou tuteur lui-même.",
        "• Lors d'un message de contact ou d'une demande d'adhésion : les renseignements que vous nous fournissez volontairement dans le formulaire.",
        "• Lors d'une conversation avec Kocc Barma, notre mentor pédagogique IA : le contenu de vos messages et, le cas échéant, un document ou une image que vous joignez.",
        "Nous ne recueillons aucun renseignement financier (numéro de carte, etc.) : les cotisations sont payées par virement Interac directement entre vous et votre institution financière, en dehors de notre site.",
      ],
      [
        "Depending on how you interact with the site, we may collect:",
        "• At membership signup: first name, last name, email, phone, city, membership year, and dues status.",
        "• In the optional family census: first name (optional), birth year, and gender of a member's children under 18, entered by the parent or legal guardian themselves.",
        "• In a contact message or membership request: the information you voluntarily provide in the form.",
        "• In a conversation with Kocc Barma, our AI educational mentor: the content of your messages and, where applicable, any document or image you attach.",
        "We never collect financial information (card numbers, etc.): membership dues are paid by Interac e-transfer directly between you and your financial institution, outside our site.",
      ]
    ),
  },
  {
    id: "finalites",
    title: L("Pourquoi nous recueillons ces renseignements", "Why we collect this information"),
    paragraphs: LP(
      [
        "• Gérer votre adhésion, votre carte de membre et le suivi de votre cotisation annuelle.",
        "• Vous donner accès à votre Espace Membre et aux documents réservés aux membres.",
        "• Mieux planifier nos activités jeunesse (ateliers, colonie de vacances) grâce au nombre, à l'âge et au genre des enfants de nos familles membres.",
        "• Répondre aux demandes envoyées par le formulaire de contact.",
        "• Offrir une assistance éducative personnalisée via Kocc Barma.",
        "• Vous informer des activités et communications d'ACAFIS Canada.",
        "Nous ne vendons ni ne louons jamais vos renseignements personnels à des tiers.",
      ],
      [
        "• Manage your membership, membership card, and annual dues tracking.",
        "• Give you access to your Member Area and members-only documents.",
        "• Better plan our youth activities (workshops, summer camp) based on the number, age, and gender of our member families' children.",
        "• Respond to requests sent through the contact form.",
        "• Provide personalized educational assistance through Kocc Barma.",
        "• Inform you about ACAFIS Canada's activities and communications.",
        "We never sell or rent your personal information to third parties.",
      ]
    ),
  },
  {
    id: "enfants",
    title: L("Renseignements concernant les enfants mineurs", "Information about minor children"),
    paragraphs: LP(
      [
        "Les renseignements sur les enfants de moins de 18 ans (recensement familial) sont fournis volontairement par le parent ou le tuteur légal, qui consent en son nom à leur collecte. Ces renseignements — âge et genre uniquement, le prénom étant facultatif — servent exclusivement à la planification interne de nos activités jeunesse et ne sont jamais partagés à l'extérieur d'ACAFIS Canada.",
        "Un parent peut en tout temps consulter, modifier ou supprimer les renseignements de ses enfants directement depuis son Espace Membre, ou en écrivant au responsable identifié plus bas.",
      ],
      [
        "Information about children under 18 (family census) is voluntarily provided by the parent or legal guardian, who consents on their behalf to its collection. This information — age and gender only, first name being optional — is used exclusively for internal planning of our youth activities and is never shared outside ACAFIS Canada.",
        "A parent may at any time view, edit, or delete their children's information directly from their Member Area, or by writing to the officer identified below.",
      ]
    ),
  },
  {
    id: "partage",
    title: L("Avec qui nous partageons ces renseignements", "Who we share this information with"),
    paragraphs: LP(
      [
        "Nous faisons appel à des prestataires de services pour faire fonctionner le site, qui traitent des renseignements uniquement pour notre compte et selon nos instructions :",
        "• Supabase (hébergement de notre base de données, région Canada) — stocke les renseignements des membres.",
        "• Resend (États-Unis) — achemine nos courriels transactionnels (accusés de réception, confirmations).",
        "• Google, via l'API Gemini (États-Unis) — traite le contenu de vos échanges avec Kocc Barma afin de générer une réponse.",
        "Certains de ces prestataires sont situés hors Québec/Canada ; nous ne retenons que des fournisseurs reconnus offrant un niveau de protection jugé équivalent. Aucun autre tiers — publicité, revente de données, courtiers en données — n'a accès à vos renseignements.",
      ],
      [
        "We rely on service providers to operate the site, who process information only on our behalf and under our instructions:",
        "• Supabase (our database hosting, Canada region) — stores member information.",
        "• Resend (United States) — delivers our transactional emails (acknowledgements, confirmations).",
        "• Google, via the Gemini API (United States) — processes the content of your exchanges with Kocc Barma to generate a reply.",
        "Some of these providers are located outside Quebec/Canada; we only use recognized providers offering an equivalent level of protection. No other third party — advertising, data resale, data brokers — has access to your information.",
      ]
    ),
  },
  {
    id: "conservation",
    title: L("Combien de temps nous les conservons", "How long we keep it"),
    paragraphs: LP(
      [
        "Vos renseignements sont conservés tant que vous demeurez membre actif d'ACAFIS Canada, puis détruits ou anonymisés dans un délai raisonnable après la fin de votre adhésion, sauf obligation légale de conservation plus longue (par exemple, les registres comptables).",
      ],
      [
        "Your information is kept for as long as you remain an active ACAFIS Canada member, then destroyed or anonymized within a reasonable time after your membership ends, unless a longer retention period is legally required (for example, accounting records).",
      ]
    ),
  },
  {
    id: "securite",
    title: L("Comment nous les protégeons", "How we protect it"),
    paragraphs: LP(
      [
        "Toutes les communications avec notre site sont chiffrées (HTTPS). L'accès à notre base de données est protégé et restreint au strict nécessaire au fonctionnement du site ; aucun mot de passe de membre n'est stocké — l'accès à l'Espace Membre se fait par courriel et numéro de membre.",
      ],
      [
        "All communications with our site are encrypted (HTTPS). Access to our database is protected and restricted to what is strictly necessary for the site to operate; no member password is stored — access to the Member Area is by email and member number.",
      ]
    ),
  },
  {
    id: "droits",
    title: L("Vos droits", "Your rights"),
    paragraphs: LP(
      [
        "Vous pouvez en tout temps :",
        "• Demander l'accès aux renseignements que nous détenons à votre sujet ou à celui de vos enfants mineurs ;",
        "• Demander leur rectification s'ils sont inexacts, incomplets ou périmés ;",
        "• Retirer votre consentement à une collecte future ou demander la suppression de vos renseignements (ce qui peut limiter votre accès à certains services, comme l'Espace Membre) ;",
        "• Déposer une plainte auprès de nous, ou de la Commission d'accès à l'information du Québec, si vous estimez que vos droits n'ont pas été respectés.",
        "Pour exercer l'un de ces droits, écrivez au responsable identifié ci-dessous.",
      ],
      [
        "You may at any time:",
        "• Request access to the information we hold about you or your minor children;",
        "• Request its correction if it is inaccurate, incomplete, or outdated;",
        "• Withdraw your consent to future collection or request that your information be deleted (which may limit your access to certain services, such as the Member Area);",
        "• File a complaint with us, or with the Commission d'accès à l'information du Québec, if you believe your rights have not been respected.",
        "To exercise any of these rights, write to the officer identified below.",
      ]
    ),
  },
  {
    id: "plainte",
    title: L("Plainte à la Commission d'accès à l'information", "Complaint to the Commission d'accès à l'information"),
    paragraphs: LP(
      [
        "Si vous n'êtes pas satisfait de notre réponse, vous pouvez déposer une plainte auprès de la Commission d'accès à l'information du Québec (cai.gouv.qc.ca).",
      ],
      [
        "If you are not satisfied with our response, you may file a complaint with the Commission d'accès à l'information du Québec (cai.gouv.qc.ca).",
      ]
    ),
  },
  {
    id: "cookies",
    title: L("Témoins de connexion (cookies) et stockage local", "Cookies and local storage"),
    paragraphs: LP(
      [
        "Notre site n'utilise aucun témoin publicitaire ni outil de suivi ou d'analyse tiers. Lorsque vous êtes connecté à votre Espace Membre, votre navigateur conserve temporairement vos informations de session dans son stockage local (« localStorage »), uniquement sur votre appareil, pour éviter d'avoir à vous reconnecter à chaque visite. Ces données ne sont jamais transmises à un tiers et sont effacées lorsque vous vous déconnectez.",
      ],
      [
        "Our site uses no advertising cookies or third-party tracking/analytics tools. When you are logged into your Member Area, your browser temporarily keeps your session information in local storage (\"localStorage\"), only on your device, so you don't have to log in again on every visit. This data is never sent to a third party and is cleared when you log out.",
      ]
    ),
  },
  {
    id: "modifications",
    title: L("Modifications de cette politique", "Changes to this policy"),
    paragraphs: LP(
      [
        "Nous pouvons mettre à jour cette politique de temps à autre. La date de la dernière mise à jour apparaît en haut de cette page. Toute modification importante sera annoncée sur notre site ou par courriel à nos membres.",
      ],
      [
        "We may update this policy from time to time. The date of the last update appears at the top of this page. Any significant change will be announced on our site or by email to our members.",
      ]
    ),
  },
];
