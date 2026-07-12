import { config } from "./config";
import type { MusicStyleId } from "./config";

/** Données brutes du formulaire de commande. */
export interface OrderData {
  names: string; // Prénoms & surnoms du couple
  story: string; // Histoire d'amour
  message: string; // Message / promesse à transmettre
  style: MusicStyleId; // Style musical choisi
  styleTitle: string; // Libellé lisible du style (confort côté n8n)
  createdAt: string; // ISO — utile pour le suivi
  version: 1; // Version du schéma (évolutivité)
}

/**
 * Alphabet du code court : lettres (min/maj) + chiffres, sans caractères
 * ambigus (0/O, 1/l/I) pour rester lisible si jamais quelqu'un le voit.
 */
const CODE_ALPHABET = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 10;

/**
 * Génère un code court aléatoire (10 caractères) qui sert de clé pour
 * retrouver la commande dans Supabase côté n8n. C'est CE code — et non les
 * données brutes — qui est injecté dans le champ personnalisé Chariow.
 * Ex. `Kf9mQ2xLpT`.
 */
export function generateOrderCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  // crypto est dispo côté navigateur ET côté Node 18+ (Vercel).
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return code;
}

/**
 * Construit l'URL finale de checkout Chariow en injectant UNIQUEMENT le code
 * court dans le paramètre de champ personnalisé configuré. Résultat propre et
 * léger, ex. `...?custom_field=Kf9mQ2xLpT`.
 */
export function buildCheckoutUrl(code: string): string {
  const url = new URL(config.chariow.checkoutUrl);
  url.searchParams.set(config.chariow.customFieldParam, code);
  return url.toString();
}
