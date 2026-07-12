import { NextResponse } from "next/server";
import { MUSIC_STYLES, type MusicStyleId } from "@/lib/config";
import { generateOrderCode, type OrderData } from "@/lib/serialize";

/**
 * Route de création de commande.
 * Reçoit les réponses du formulaire, génère un code court unique et enregistre
 * la commande dans Supabase. Ne renvoie au client QUE le code court, qui sera
 * injecté dans le champ personnalisé Chariow.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TABLE = "memorart_orders";

function supabaseEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

/** Insère la commande dans Supabase. Renvoie true si OK, "conflict" si le code
 * existe déjà (collision), false sur toute autre erreur. */
async function insertOrder(
  env: { url: string; key: string },
  code: string,
  data: OrderData,
): Promise<true | "conflict" | false> {
  const res = await fetch(`${env.url}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: env.key,
      Authorization: `Bearer ${env.key}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      code,
      names: data.names,
      story: data.story,
      message: data.message,
      style: data.style,
      style_title: data.styleTitle,
      status: "pending",
      created_at: data.createdAt,
    }),
  });

  if (res.ok) return true;
  // 409 = violation de contrainte unique (code déjà pris) → on réessaie.
  if (res.status === 409) return "conflict";
  return false;
}

export async function POST(request: Request) {
  let body: Partial<OrderData>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const names = (body.names ?? "").toString().trim();
  const story = (body.story ?? "").toString().trim();
  const message = (body.message ?? "").toString().trim();
  const styleId = (body.style ?? "").toString() as MusicStyleId;
  const style = MUSIC_STYLES.find((s) => s.id === styleId);

  if (!names || !story || !message || !style) {
    return NextResponse.json(
      { error: "Merci de remplir tous les champs." },
      { status: 400 },
    );
  }

  const env = supabaseEnv();
  if (!env) {
    return NextResponse.json(
      { error: "Service temporairement indisponible. Réessayez." },
      { status: 500 },
    );
  }

  const data: OrderData = {
    names: names.slice(0, 120),
    story: story.slice(0, 1500),
    message: message.slice(0, 200),
    style: style.id,
    styleTitle: style.title,
    createdAt: new Date().toISOString(),
    version: 1,
  };

  // Génère un code unique — jusqu'à 5 tentatives en cas de collision (rarissime).
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateOrderCode();
    const result = await insertOrder(env, code, data);
    if (result === true) {
      return NextResponse.json({ code });
    }
    if (result === false) {
      return NextResponse.json(
        { error: "Enregistrement impossible. Réessayez dans un instant." },
        { status: 502 },
      );
    }
    // "conflict" → nouvelle tentative avec un autre code.
  }

  return NextResponse.json(
    { error: "Impossible de générer la commande. Réessayez." },
    { status: 500 },
  );
}
