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
 * Encode une chaîne UTF-8 en Base64-URL (sûr pour une URL : pas de +, /, =).
 * Fonctionne côté navigateur ET côté Node (Vercel).
 */
function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  const base64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(input, "utf-8").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Décode une chaîne Base64-URL vers UTF-8 (utile pour tester / côté n8n JS). */
export function fromBase64Url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary =
    typeof atob !== "undefined"
      ? atob(base64)
      : Buffer.from(base64, "base64").toString("binary");
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Sérialise les données de commande en un jeton compact et sûr pour l'URL. */
export function serializeOrder(data: OrderData): string {
  return toBase64Url(JSON.stringify(data));
}

/** Reconstruit les données depuis le jeton (miroir de serializeOrder). */
export function deserializeOrder(token: string): OrderData {
  return JSON.parse(fromBase64Url(token)) as OrderData;
}

/**
 * Construit l'URL finale de checkout Chariow avec les données injectées
 * dans le paramètre de champ personnalisé configuré.
 */
export function buildCheckoutUrl(data: OrderData): string {
  const token = serializeOrder(data);
  const url = new URL(config.chariow.checkoutUrl);
  url.searchParams.set(config.chariow.customFieldParam, token);
  return url.toString();
}
