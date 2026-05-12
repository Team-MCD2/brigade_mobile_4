"use client";

import dynamic from "next/dynamic";

const QuoteWizard = dynamic(
  () => import("@/app/devis/_components/quote-wizard").then((m) => ({ default: m.QuoteWizard })),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center font-num text-sm text-muted-foreground sm:px-6">
        Chargement du devis…
      </div>
    ),
  },
);

export function DevisWizardLoader() {
  return <QuoteWizard />;
}
