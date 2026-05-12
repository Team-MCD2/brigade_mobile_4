import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, Clock, Phone, Shield, Sparkles, Wrench } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { getServiceBySlug } from "@/lib/data/servicePages";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { SERVICE_PAGES } = await import("@/lib/data/servicePages");
  return SERVICE_PAGES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getServiceBySlug(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: `${siteConfig.url}/services/${slug}` },
  };
}

export default async function ServiceSlugPage({ params }: Props) {
  const { slug } = await params;
  const s = getServiceBySlug(slug);
  if (!s) notFound();

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.description,
    provider: { "@type": "LocalBusiness", name: siteConfig.name, address: siteConfig.address.full },
    areaServed: "Toulouse",
  };

  return (
    <div className="border-b border-border">
      <JsonLd data={productLd} />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>
          <ChevronRight className="size-3.5" aria-hidden />
          <Link href="/services" className="hover:text-foreground">
            Services
          </Link>
          <ChevronRight className="size-3.5" aria-hidden />
          <span className="text-foreground">{s.title}</span>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
          <article>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{s.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{s.description}</p>
            <div className="mt-10 space-y-5 text-base leading-relaxed text-foreground/90">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3 lg:hidden">
              <Button asChild className="rounded-lg">
                <Link href="/devis">
                  <Sparkles className="size-4" />
                  Devis
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-lg">
                <a href={`tel:${siteConfig.contact.phoneE164}`}>
                  <Phone className="size-4" />
                  Appeler
                </a>
              </Button>
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="font-num text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Synthèse
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex gap-3">
                    <Clock className="size-4 shrink-0 text-primary" />
                    <span>
                      ~<span className="font-num font-medium">{siteConfig.stats.repairMinutes} min</span> en moyenne
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Wrench className="size-4 shrink-0 text-primary" />
                    <span>Diagnostic gratuit</span>
                  </li>
                  <li className="flex gap-3">
                    <Shield className="size-4 shrink-0 text-primary" />
                    <span>
                      Garantie <span className="font-num font-medium">{siteConfig.stats.warrantyMonths} mois</span>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/[0.05] p-6">
                <p className="font-semibold">Passer à l&apos;action</p>
                <p className="mt-1 text-sm text-muted-foreground">Devis aligné sur votre appareil exact.</p>
                <Button asChild className="mt-4 w-full rounded-lg">
                  <Link href="/devis">
                    <Sparkles className="size-4" />
                    Devis en ligne
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
