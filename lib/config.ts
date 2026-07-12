/**
 * ============================================================================
 *  CONFIGURATION CENTRALE — MEMORART
 * ============================================================================
 *  👉 C'EST LE SEUL FICHIER À MODIFIER pour brancher ton produit Chariow.
 *
 *  Comment ça marche :
 *  1. Le client remplit le formulaire sur le site.
 *  2. Au clic sur "Valider et passer au paiement", ses réponses sont
 *     enregistrées dans Supabase et un code court unique (ex. Kf9mQ2xLpT) est
 *     injecté dans l'URL de checkout Chariow via `CHARIOW_CUSTOM_FIELD`.
 *  3. Chariow encaisse (Mobile Money), puis envoie un webhook à n8n avec ce
 *     code → n8n lit la commande dans Supabase et génère la chanson via
 *     Apiframe (Suno).
 *
 *  Tu peux surcharger ces valeurs sans toucher au code en définissant les
 *  variables d'environnement correspondantes dans Vercel (voir .env.example).
 * ============================================================================
 */

export const config = {
  brand: {
    name: "Memorart",
    tagline: "Vos souvenirs transformés en chanson",
  },

  chariow: {
    /**
     * URL de base du checkout de TON produit Chariow.
     * ⚠️ REMPLACE cette valeur par l'URL réelle de ton produit.
     * Exemple : https://tayc.chariow.store/checkout/chanson-personnalisee
     */
    checkoutUrl:
      process.env.NEXT_PUBLIC_CHARIOW_CHECKOUT_URL ??
      "https://VOTRE-BOUTIQUE.chariow.store/checkout/VOTRE-PRODUIT",

    /**
     * Nom du paramètre de champ personnalisé attendu par Chariow dans l'URL.
     * C'est CE paramètre que ton webhook n8n devra lire puis décoder.
     * Chariow utilise souvent `custom_field` ou `cf` ; adapte selon ton compte.
     */
    customFieldParam:
      process.env.NEXT_PUBLIC_CHARIOW_CUSTOM_FIELD ?? "custom_field",
  },

  /** Numéro WhatsApp de contact affiché pour rassurer (optionnel). */
  supportWhatsapp:
    process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? "", // ex: "22890000000"
} as const;

/** Les 6 styles musicaux proposés (max 6, conformément à la spec). */
export type MusicStyleId =
  | "afro-soul"
  | "kizomba"
  | "acoustique"
  | "rumba"
  | "afrobeats"
  | "gospel";

export interface MusicStyle {
  id: MusicStyleId;
  emoji: string;
  title: string;
  subtitle: string;
}

export const MUSIC_STYLES: MusicStyle[] = [
  {
    id: "afro-soul",
    emoji: "✨",
    title: "Afro-Soul / R&B Lover",
    subtitle: "Doux, moderne et envoûtant — style Tayc / CKay",
  },
  {
    id: "kizomba",
    emoji: "💃",
    title: "Kizomba / Zouk / Kompa",
    subtitle: "Sensuel, romantique — le rythme des amoureux",
  },
  {
    id: "acoustique",
    emoji: "🎸",
    title: "Acoustique Émotion",
    subtitle: "Guitare ou piano épuré, voix intimiste — idéal pour émouvoir",
  },
  {
    id: "rumba",
    emoji: "👑",
    title: "Rumba / Variété Africaine",
    subtitle: "Classique, poétique et intemporel — le prestige",
  },
  {
    id: "afrobeats",
    emoji: "☀️",
    title: "Afrobeats Sweet / Afro-Pop",
    subtitle: "Joyeux, festif et dansant — l'amour en fête",
  },
  {
    id: "gospel",
    emoji: "🙏",
    title: "Afro-Gospel / Bénédiction",
    subtitle: "Chœurs puissants, gratitude et spiritualité",
  },
];
