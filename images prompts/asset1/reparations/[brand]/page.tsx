import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ModelsSearch } from "@/app/reparations/[brand]/models-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BRANDS, type BrandId } from "@/lib/data/brands";
import { getModelsByBrand } from "@/lib/data/models";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ brand: string }> };

export function generateStaticParams() {
  return BRANDS.map((b) => ({ brand: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const b = BRANDS.find((x) => x.id === brand);
  const title = b ? `Réparation ${b.name} Toulouse` : "Réparations";
  return {
    title,
    description: `${title} — devis en ligne, garantie ${siteConfig.stats.warrantyMonths} mois.`,
    alternates: { canonical: `${siteConfig.url}/reparations/${brand}` },
  };
}

export default async function BrandRepairsPage({ params }: Props) {
  const { brand } = await params;
  const b = BRANDS.find((x) => x.id === brand);
  if (!b) notFound();
  const models = getModelsByBrand(b.id as BrandId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <nav className="font-num text-xs uppercase tracking-wider text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Réparation {b.name}</span>
      </nav>
      <Badge variant="outline" className="mt-6 rounded-full font-num text-[11px] uppercase tracking-widest">
        {b.name}
      </Badge>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Réparation {b.name} à Toulouse</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Choisissez votre modèle — prix à partir de affichés. Besoin d&apos;un autre appareil&nbsp;?
        <Link href="/devis" className="ml-1 font-medium text-primary hover:underline">
          Devis guidé
        </Link>
        .
      </p>
      {models.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center">
          <p className="text-muted-foreground">Modèles sur devis personnalisé.</p>
          <Button asChild className="mt-6 rounded-lg">
            <Link href="/devis">Lancer le devis</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-12">
          <ModelsSearch brandSlug={brand} models={models} />
        </div>
      )}
    </div>
  );
}
