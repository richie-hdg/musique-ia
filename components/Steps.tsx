const STEPS = [
  {
    emoji: "✍️",
    title: "Racontez votre histoire",
    text: "Vos prénoms, votre rencontre, vos épreuves traversées et vos plus beaux souvenirs.",
  },
  {
    emoji: "🎵",
    title: "Choisissez l'ambiance",
    text: "Sélectionnez le rythme parfait parmi nos 6 styles musicaux exclusifs.",
  },
  {
    emoji: "📲",
    title: "Recevez sur WhatsApp",
    text: "Votre chanson unique livrée sur votre téléphone sous 24h, prête pour la surprise.",
  },
];

export default function Steps() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
      <div className="mb-12 text-center">
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
          Simple comme <span className="text-gold">1, 2, 3</span>
        </h2>
        <p className="mt-3 text-cream/60">
          Moins de 2 minutes pour commander la surprise d'une vie.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="relative rounded-2xl border border-white/10 bg-surface p-6 transition hover:border-gold/30 hover:shadow-lg hover:shadow-black/30"
          >
            <span className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-romance text-sm font-bold text-white shadow-md shadow-romance/40">
              {i + 1}
            </span>
            <div className="text-4xl">{step.emoji}</div>
            <h3 className="mt-4 font-serif text-xl font-semibold text-gold">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/65">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
