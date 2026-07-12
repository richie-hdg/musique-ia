import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Memorart — Offrez une chanson personnalisée, née de votre histoire",
  description:
    "Transformez vos plus beaux souvenirs en une chanson unique, entièrement personnalisée. Livrée sur WhatsApp sous 24h. La surprise qui fait couler les larmes de joie.",
  openGraph: {
    title: "Memorart — Vos souvenirs transformés en chanson",
    description:
      "Une chanson d'amour unique, créée à partir de votre histoire. Livrée sur WhatsApp sous 24h.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF6F1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
