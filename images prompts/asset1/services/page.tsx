import Link from "next/link";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Battery, Cable, Droplets, Laptop, Smartphone, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SERVICE_PAGES } from "@/lib/data/servicePages";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services de réparation",
  description: "Smartphones, tablettes, MacBook, PC — diagnostic gratuit, devis en ligne.",
  alternates: { canonical: `${siteConfig.url}/services` },
};

const iconMap: Record<string, LucideIcon> = {
  "ecran-iphone-toulouse": Smartphone,
  "batterie-smartphone": Battery,
  "macbook-apple": Laptop,
  "desoxydation-eau": Droplets,
  "connecteur-charge": Cable,
};

export default function ServicesPage() {
  const [featured, ...rest] = SERVICE_PAGES;
  const Fi = iconMap[featured.slug] ?? Smartphone;

  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
        <Badge variant="outline" className="rounded-full font-num text-[11px] uppercase tracking-widest">
          Catalogue
        </Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Services</h1>
        <p className="mt-4 text-muted-foreground">
          Typologie claire, engagement sur la transparence — garantie {siteConfig.stats.warrantyMonths} mois.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <Link
            href={`/services/${featured.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-0.5 hover:border-foreground/15 md:col-span-2 md:row-span-2"
          >
            <div>
              <div className="inline-flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Fi className="size-7" />
              </div>
              <h2 className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">{featured.title}</h2>
              <p className="mt-4 max-w-lg text-muted-foreground">{featured.description}</p>
            </div>
            <span className="mt-10 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Détail <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          {rest.map((s) => {
            const I = iconMap[s.slug] ?? Smartphone;
            return (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-foreground/15"
              >
                <div>
                  <I className="size-6 text-primary" />
                  <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>
                </div>
                <ArrowRight className="mt-6 size-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <p className="text-center text-muted-foreground sm:text-left">Cas non listé&nbsp;? Le devis guidé couvre tout.</p>
          <Button asChild className="rounded-lg">
            <Link href="/devis">
              <Sparkles className="size-4" />
              Devis
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
