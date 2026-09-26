import { Localized } from "../types";
import { ORGANIZATION_NEQ } from "./acafisData";

const L = (fr: string, en: string): Localized => ({ fr, en });
const LP = (fr: string[], en: string[]): Localized<string[]> => ({ fr, en });

// Kept separate from acafisData.ts for the same reason as privacyPolicy.ts —
// legal/compliance content reviewed on its own track by the Bureau Exécutif.
export const LEGAL_NOTICE_LAST_UPDATED = "2026-09-26";

export const ORGANIZATION_ADDRESS = "4845, avenue de Courtrai, suite 101, Montréal, QC H3W 0A2, Canada";
export const ORGANIZATION_CONTACT_EMAIL = "secretariat@acafis.ca";

export const PUBLICATION_DIRECTOR = {
  name: "Moustapha Sane",
  title: L("Président, ACAFIS Canada", "President, ACAFIS Canada"),
};

export interface LegalNoticeSection {
  id: string;
  title: Localized;
  paragraphs: Localized<string[]>;
}

export const LEGAL_NOTICE_SECTIONS: LegalNoticeSection[] = [
  {
    id: "editeur",
    title: L("Éditeur du site", "Site Publisher"),
    paragraphs: LP(
      [
        `Le site acafis-canada.vercel.app est édité par ACAFIS Canada (Association Communautaire d'Aide aux Familles Immigrantes Sénégalaises), organisme à but non lucratif immatriculé au Registre des entreprises du Québec sous le numéro NEQ ${ORGANIZATION_NEQ}.`,
        `Adresse : ${ORGANIZATION_ADDRESS}`,
        `Courriel : ${ORGANIZATION_CONTACT_EMAIL}`,
      ],
      [
        `The site acafis-canada.vercel.app is published by ACAFIS Canada (Association Communautaire d'Aide aux Familles Immigrantes Sénégalaises), a non-profit organization registered with the Quebec Enterprise Registrar under NEQ ${ORGANIZATION_NEQ}.`,
        `Address: ${ORGANIZATION_ADDRESS}`,
        `Email: ${ORGANIZATION_CONTACT_EMAIL}`,
      ]
    ),
  },
  {
    id: "directeur-publication",
    title: L("Directeur de la publication", "Publication Director"),
    paragraphs: LP(
      [
        `${PUBLICATION_DIRECTOR.name}, ${PUBLICATION_DIRECTOR.title.fr}, est responsable de la publication du site au sens de la loi.`,
      ],
      [
        `${PUBLICATION_DIRECTOR.name}, ${PUBLICATION_DIRECTOR.title.en}, is responsible for the site's publication within the meaning of the law.`,
      ]
    ),
  },
  {
    id: "hebergement",
    title: L("Hébergement", "Hosting"),
    paragraphs: LP(
      [
        "Le site est hébergé par Vercel Inc. (https://vercel.com), un fournisseur d'infrastructure infonuagique. Les coordonnées légales complètes de l'hébergeur sont disponibles sur son site officiel.",
      ],
      [
        "The site is hosted by Vercel Inc. (https://vercel.com), a cloud infrastructure provider. The hosting provider's full legal details are available on its official website.",
      ]
    ),
  },
  {
    id: "propriete-intellectuelle",
    title: L("Propriété intellectuelle", "Intellectual Property"),
    paragraphs: LP(
      [
        "L'ensemble des textes, images, logos et autres contenus présents sur ce site sont la propriété d'ACAFIS Canada, sauf mention contraire, et ne peuvent être reproduits sans autorisation préalable.",
        "Les logos et marques de nos partenaires demeurent la propriété de leurs détenteurs respectifs.",
      ],
      [
        "All text, images, logos, and other content on this site are the property of ACAFIS Canada, unless otherwise stated, and may not be reproduced without prior authorization.",
        "Our partners' logos and trademarks remain the property of their respective owners.",
      ]
    ),
  },
  {
    id: "liens",
    title: L("Liens hypertextes", "Hyperlinks"),
    paragraphs: LP(
      [
        "Ce site contient des liens vers des sites tiers (Coop-ACAFIS, boutique en ligne, réseaux sociaux). ACAFIS Canada n'est pas responsable du contenu ou des pratiques de ces sites externes.",
      ],
      [
        "This site contains links to third-party sites (Coop-ACAFIS, online shop, social media). ACAFIS Canada is not responsible for the content or practices of these external sites.",
      ]
    ),
  },
  {
    id: "droit-applicable",
    title: L("Droit applicable", "Governing Law"),
    paragraphs: LP(
      [
        "Les présentes mentions légales sont régies par les lois de la province de Québec et du Canada.",
      ],
      [
        "This legal notice is governed by the laws of the province of Quebec and of Canada.",
      ]
    ),
  },
];
