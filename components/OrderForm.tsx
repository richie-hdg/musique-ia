"use client";

import { useState } from "react";
import { MUSIC_STYLES, type MusicStyleId } from "@/lib/config";
import { buildCheckoutUrl } from "@/lib/serialize";

export default function OrderForm() {
  const [names, setNames] = useState("");
  const [story, setStory] = useState("");
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState<MusicStyleId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!names.trim() || !story.trim() || !message.trim()) {
      setError("Merci de remplir tous les champs pour créer votre chanson. 💫");
      return;
    }
    if (!style) {
      setError("Choisissez le style musical de votre chanson. 🎵");
      return;
    }

    setSubmitting(true);
    try {
      // 1. On enregistre la commande côté serveur (Supabase) et on récupère
      //    un code court unique.
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          names: names.trim(),
          story: story.trim(),
          message: message.trim(),
          style,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        code?: string;
        error?: string;
      };
      if (!res.ok || !payload.code) {
        throw new Error(payload.error ?? "Une erreur est survenue.");
      }
      // 2. Redirection vers le checkout Chariow avec seulement le code court.
      window.location.href = buildCheckoutUrl(payload.code);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de valider la commande. Réessayez.",
      );
      setSubmitting(false);
    }
  };

  return (
    <section id="commande" className="scroll-mt-8 px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            Composons <span className="text-gold">votre chanson</span>
          </h2>
          <p className="mt-3 text-cream/60">
            Racontez-nous l'essentiel. Plus c'est sincère, plus la chanson
            touchera au cœur.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-surface p-6 shadow-2xl shadow-black/40 sm:p-8"
        >
          {/* Champ 1 : Prénoms & surnoms */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-cream">
              Vos prénoms &amp; surnoms 💞
            </label>
            <input
              type="text"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder='Ex : Ibrahim & Fatou "Ma Reine"'
              className="field"
              maxLength={120}
            />
          </div>

          {/* Champ 2 : Histoire d'amour */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-cream">
              Votre histoire d'amour ✨
            </label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Où vous êtes-vous rencontrés ? Une épreuve traversée ensemble ? Un souvenir qui vous fait sourire à chaque fois…"
              className="field min-h-[140px] resize-y"
              maxLength={1500}
            />
            <p className="mt-1.5 text-right text-xs text-cream/35">
              {story.length}/1500
            </p>
          </div>

          {/* Champ 3 : Message / promesse */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-cream">
              Le message ou la promesse à transmettre 🌹
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex : Pour ses 30 ans, lui dire merci d'être mon pilier"
              className="field"
              maxLength={200}
            />
          </div>

          {/* Champ 4 : Sélecteur de style musical */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium text-cream">
              Choisissez l'ambiance musicale 🎶
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {MUSIC_STYLES.map((s) => {
                const active = style === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id)}
                    aria-pressed={active}
                    className={`group flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-romance bg-romance/10 shadow-md shadow-romance/20"
                        : "border-white/10 bg-night/40 hover:border-gold/30 hover:bg-night/70"
                    }`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="flex-1">
                      <span
                        className={`block text-sm font-semibold ${
                          active ? "text-romance" : "text-cream"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-cream/55">
                        {s.subtitle}
                      </span>
                    </span>
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[11px] ${
                        active
                          ? "border-romance bg-romance text-white"
                          : "border-white/20 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-romance/30 bg-romance/10 px-4 py-3 text-sm text-romance">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-romance px-8 py-4 text-base font-semibold text-white shadow-lg shadow-romance/30 transition hover:scale-[1.01] hover:bg-romance/90 hover:shadow-romance/50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Redirection sécurisée…" : "Valider et passer au paiement →"}
          </button>

          <p className="mt-4 text-center text-xs text-cream/45">
            🔒 Paiement 100 % sécurisé par Mobile Money (Orange, Moov, MTN, Wave)
          </p>
        </form>
      </div>
    </section>
  );
}
