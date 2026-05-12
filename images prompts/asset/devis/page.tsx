import type { Metadata } from "next";
import { Suspense } from "react";

import { DevisWizardLoader } from "@/app/devis/devis-wizard-loader";
import { JsonLd, devisOnlineSchema } from "@/components/json-ld";
import { siteConfig } from "@/lib/site-config";

const devisUrl = `${siteConfig.url}/devis`;

export const metadata: Metadata = {
  title: "Devis réparation en ligne",
  description:
    "Devis guidé pour réparation smartphone, tablette, MacBook et console à Toulouse — estimation TTC, prise en charge boutique, domicile ou postal.",
  keywords: [
    "devis réparation téléphone Toulouse",
    "devis iPhone Toulouse",
    "réparation Samsung Toulouse",
    "devis MacBook Toulouse",
    "La Brigade Mobile",
    "réparation Blagnac",
  ],
  alternates: { canonical: devisUrl },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: devisUrl,
    siteName: siteConfig.name,
    title: `Devis réparation en ligne · ${siteConfig.name}`,
    description:
      "Parcours guidé : appareil, panne, mode d’enlèvement, créneau — estimation indicative, diagnostic gratuit en boutique.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Devis réparation · ${siteConfig.name}`,
    description: "Estimation en ligne — smartphone, tablette, PC, console — Toulouse.",
  },
};

export default function DevisPage() {
  return (
    <div className="bg-muted/30">
      <JsonLd data={devisOnlineSchema()} />
      <Suspense
        fallback={
          <div className="mx-auto max-w-4xl px-4 py-24 text-center font-num text-sm text-muted-foreground sm:px-6">
            Chargement du devis…
          </div>
        }
      >
        <DevisWizardLoader />
      </Suspense>
    </div>
  );
}
