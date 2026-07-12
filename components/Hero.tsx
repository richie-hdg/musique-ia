export default function Hero() {
  return (
    <section className="romantic-glow relative overflow-hidden">
      {/* Notes de musique flottantes en décor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none"
      >
        <span className="absolute left-[8%] top-[18%] text-4xl text-gold/20 animate-float-slow">
          ♪
        </span>
        <span className="absolute right-[12%] top-[28%] text-5xl text-romance/20 animate-float-slow [animation-delay:1.5s]">
          ♫
        </span>
        <span className="absolute left-[18%] bottom-[14%] text-3xl text-gold/15 animate-float-slow [animation-delay:3s]">
          ♩
        </span>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pb-20 pt-24 text-center sm:pt-28">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-gold animate-fade-up">
          ✨ Cadeau 100 % unique & personnalisé
        </span>

        <h1 className="font-serif text-4xl font-bold leading-tight animate-fade-up [animation-delay:0.1s] sm:text-6xl">
          Offrez-lui le plus beau des cadeaux :{" "}
          <span className="text-gold-shimmer">
            vos plus beaux souvenirs transformés en chanson.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 animate-fade-up [animation-delay:0.2s] sm:text-lg">
          Une surprise inoubliable, entièrement composée à partir de{" "}
          <span className="text-ink">votre histoire</span>. Imaginez les larmes
          d'émotion couler sur son visage lorsqu'il — ou elle — comprendra que{" "}
          <span className="text-ink">chaque mot parle de vous deux</span>.
        </p>

        <a
          href="#commande"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-romance px-8 py-4 text-base font-semibold text-white shadow-lg shadow-romance/30 transition hover:scale-[1.03] hover:bg-romance/90 hover:shadow-romance/50 animate-fade-up [animation-delay:0.3s]"
        >
          Créer notre chanson surprise
          <span className="transition group-hover:translate-y-0.5">↓</span>
        </a>

        <p className="mt-5 text-sm text-ink/50 animate-fade-up [animation-delay:0.4s]">
          🎧 Prête en moins de 24h &nbsp;•&nbsp; 📲 Livrée directement sur
          WhatsApp
        </p>
      </div>
    </section>
  );
}
