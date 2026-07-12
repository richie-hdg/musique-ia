import Hero from "@/components/Hero";
import Steps from "@/components/Steps";
import OrderForm from "@/components/OrderForm";
import { config } from "@/lib/config";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Steps />
      <OrderForm />

      {/* Réassurance finale minimaliste (pas de footer surchargé) */}
      <footer className="border-t border-black/5 px-5 py-10 text-center">
        <p className="font-serif text-lg text-gold">{config.brand.name}</p>
        <p className="mt-1 text-sm text-ink/50">
          {config.brand.tagline} — fait avec ❤️ en Afrique de l'Ouest.
        </p>
        {config.supportWhatsapp && (
          <a
            href={`https://wa.me/${config.supportWhatsapp}`}
            className="mt-3 inline-block text-sm text-ink/60 underline decoration-dotted hover:text-gold"
          >
            Une question ? Écrivez-nous sur WhatsApp
          </a>
        )}
      </footer>
    </main>
  );
}
