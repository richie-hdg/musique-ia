"use client";

import { useState } from "react";
import { MUSIC_STYLES, type MusicStyleId } from "@/lib/config";
import { buildCheckoutUrl } from "@/lib/serialize";

export default function OrderForm() {
  const [ordererName, setOrdererName] = useState("");
  const [ordererNickname, setOrdererNickname] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerNickname, setPartnerNickname] = useState("");
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState<MusicStyleId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ordererName.trim() || !partnerName.trim() || !message.trim()) {
      setError("Merci de remplir les champs obligatoires pour créer votre chanson. 💫");
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
          ordererName: ordererName.trim(),
          ordererNickname: ordererNickname.trim(),
          partnerName: partnerName.trim(),
          partnerNickname: partnerNickname.trim(),
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
          <p className="mt-3 text-ink/60">
            Racontez-nous l'essentiel. Plus c'est sincère, plus la chanson
            touchera au cœur.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-black/5 bg-surface p-6 shadow-xl shadow-romance/10 sm:p-8"
        >
          {/* Bloc 1 : Qui commande */}
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-romance">
            Vous
          </p>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Votre prénom <span className="text-romance">*</span>
              </label>
              <input
                type="text"
                value={ordererName}
                onChange={(e) => setOrdererName(e.target.value)}
                placeholder="Ex : Ibrahim"
                className="field"
                maxLength={80}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Votre surnom{" "}
                <span className="text-ink/40">(optionnel)</span>
              </label>
              <input
                type="text"
                value={ordererNickname}
                onChange={(e) => setOrdererNickname(e.target.value)}
                placeholder="Ex : Ton Roi 👑"
                className="field"
                maxLength={80}
              />
            </div>
          </div>

          {/* Bloc 2 : La personne à qui la chanson est dédiée */}
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-romance">
            Votre moitié 💞
          </p>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Son prénom <span className="text-romance">*</span>
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Ex : Fatou"
                className="field"
                maxLength={80}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Son surnom{" "}
                <span className="text-ink/40">(optionnel)</span>
              </label>
              <input
                type="text"
                value={partnerNickname}
                onChange={(e) => setPartnerNickname(e.target.value)}
                placeholder="Ex : Ma Reine ✨"
                className="field"
                maxLength={80}
              />
            </div>
          </div>

          {/* Bloc 3 : Le message + l'histoire */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-ink">
              Le message à transmettre &amp; votre histoire d'amour{" "}
              <span className="text-romance">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Que voulez-vous lui dire dans cette chanson ? Racontez votre histoire : votre rencontre, un souvenir fort, une épreuve traversée ensemble, une promesse… Plus c'est personnel, plus la chanson sera touchante."
              className="field min-h-[170px] resize-y"
              maxLength={2000}
            />
            <p className="mt-1.5 text-right text-xs text-ink/40">
              {message.length}/2000
            </p>
          </div>

          {/* Bloc 4 : Sélecteur de style musical */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium text-ink">
              Choisissez l'ambiance musicale{" "}
              <span className="text-romance">*</span>
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
                        : "border-black/10 bg-white/60 hover:border-gold/50 hover:bg-white"
                    }`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="flex-1">
                      <span
                        className={`block text-sm font-semibold ${
                          active ? "text-romance" : "text-ink"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-ink/55">
                        {s.subtitle}
                      </span>
                    </span>
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[11px] ${
                        active
                          ? "border-romance bg-romance text-white"
                          : "border-black/20 text-transparent"
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

          <p className="mt-4 text-center text-xs text-ink/45">
            🔒 Paiement 100 % sécurisé par Mobile Money (Orange, Moov, MTN, Wave)
          </p>
        </form>
      </div>
    </section>
  );
}
