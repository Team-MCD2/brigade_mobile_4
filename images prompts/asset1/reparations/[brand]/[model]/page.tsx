import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { computeQuoteTotal } from "@/lib/data/repairCatalog";
import {
  formatMarketBandEuro,
  getElsewhereRepairPriceBandEuro,
  MARKET_COMPARABLE_DISCLAIMER,
} from "@/lib/data/market-benchmarks";
import { getModelBySlug } from "@/lib/data/models";
import { REPAIR_IDS, REPAIR_LABELS } from "@/lib/data/repairs";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ brand: string; model: string }> };

export async function generateStaticParams() {
  const { MODELS } = await import("@/lib/data/models");
  return MODELS.map((m) => ({
    brand: m.brandId,
    model: m.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand, model } = await params;
  const m = getModelBySlug(brand, model);
  if (!m) return {};
  return {
    title: `Réparation ${m.name}`,
    description: `Écran, batterie, caméra… ${m.name} à Toulouse — devis instantané, garantie ${siteConfig.stats.warrantyMonths} mois.`,
    alternates: { canonical: `${siteConfig.url}/reparations/${brand}/${model}` },
  };
}

export default async function ModelRepairPage({ params }: Props) {
  const { brand, model } = await params;
  const m = getModelBySlug(brand, model);
  if (!m) notFound();

  const example = computeQuoteTotal({
    modelId: m.id,
    category: m.category,
    repairs: ["screen"],
    pickup: "boutique",
  });

  const nums = Object.values(m.repairs).filter((x): x is number => typeof x === "number");
  const low = nums.length ? Math.min(...nums) : 0;
  const high = nums.length ? Math.max(...nums) : 0;
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${m.name} — réparation`,
    brand: m.brandId,
    description: `Réparation ${m.name} à Toulouse — ${siteConfig.name}.`,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: low,
      highPrice: high,
      priceCurrency: "EUR",
    },
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <JsonLd data={productLd} />
      <nav className="font-num text-xs uppercase tracking-wider text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/reparations/${brand}`} className="hover:text-foreground">
          {m.brandId}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{m.name}</span>
      </nav>
      <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Réparation {m.name}</h1>
      <p className="mt-4 text-muted-foreground">
        Exemple écran :{" "}
        <span className="font-num font-semibold text-foreground">{example.total} €</span> en boutique (indicatif —
        diagnostic gratuit).
      </p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {REPAIR_IDS.filter((id) => id !== "other").flatMap((id) => {
          const price = m.repairs[id];
          if (typeof price !== "number") return [];
          const band = getElsewhereRepairPriceBandEuro({
            modelId: m.id,
            category: m.category,
            repairId: id,
            atelierTTC: price,
          });
          return [
            <Card key={id} className="rounded-xl border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">{REPAIR_LABELS[id].label}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <Badge variant="secondary" className="font-num w-fit font-medium">
                    à partir de {price} €
                  </Badge>
                  {band ? (
                    <p className="font-num text-xs text-muted-foreground">
                      Ailleurs (même réparation, est.) : {formatMarketBandEuro(band)}
                    </p>
                  ) : null}
                </div>
                <Button asChild size="sm" className="rounded-lg">
                  <Link href={`/devis?model=${encodeURIComponent(m.id)}&repairs=${id}`}>Devis</Link>
                </Button>
              </CardContent>
            </Card>,
          ];
        })}
      </div>
      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{MARKET_COMPARABLE_DISCLAIMER}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild size="lg" className="rounded-lg">
          <Link href={`/devis?model=${encodeURIComponent(m.id)}`}>Parcours complet</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-lg">
          <Link href="/boutique">Boutique</Link>
        </Button>
      </div>
    </article>
  );
}
