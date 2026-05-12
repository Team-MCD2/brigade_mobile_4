"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Home, MapPin, Phone, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PICKUP_MODE_META, type PickupModeId } from "@/lib/data/pickupModes";
import { siteConfig } from "@/lib/site-config";

export default function ConfirmationPage() {
  const params = useParams<{ ref: string }>();
  const ref = params.ref;
  const [data, setData] = React.useState<Record<string, unknown> | null>(null);

  React.useEffect(() => {
    const raw = sessionStorage.getItem(`quote-${ref}`);
    if (raw) {
      try {
        setData(JSON.parse(raw) as Record<string, unknown>);
      } catch {
        setData(null);
      }
    }
  }, [ref]);

  const pickup = data?.pickupMode ? PICKUP_MODE_META[data.pickupMode as PickupModeId] : null;

  return (
    <div className="bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <Card className="rounded-2xl border-border shadow-none">
          <CardHeader className="text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-7" />
            </div>
            <CardTitle className="mt-4 text-2xl">Demande enregistrée</CardTitle>
            <p className="text-sm text-muted-foreground">
              Référence{" "}
              <span className="font-num rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">{ref}</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {data && (
              <dl className="space-y-3 rounded-xl border border-border bg-muted/50 p-4 text-sm">
                {data.total != null && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Total indicatif</dt>
                    <dd className="font-num font-semibold">{String(data.total)} €</dd>
                  </div>
                )}
                {pickup && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Mode</dt>
                    <dd className="text-right font-medium">{pickup.title}</dd>
                  </div>
                )}
                {!!data.appointmentDate && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Créneau</dt>
                    <dd className="font-num text-right">
                      {String(data.appointmentDate)} {String(data.appointmentSlot ?? "")}
                    </dd>
                  </div>
                )}
              </dl>
            )}
            <p className="text-sm text-muted-foreground">
              Notre équipe confirme sous peu. Besoin d&apos;aller plus vite&nbsp;? Appelez l&apos;atelier.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild className="rounded-lg">
                <Link href="/devis">
                  <Sparkles className="size-4" />
                  Nouveau devis
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-lg">
                <Link href="/boutique">
                  <MapPin className="size-4" />
                  Boutique
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-lg sm:col-span-2">
                <a href={`tel:${siteConfig.contact.phoneE164}`}>
                  <Phone className="size-4" />
                  Appeler
                </a>
              </Button>
            </div>
            <Button asChild variant="link" className="h-auto w-full px-0 text-muted-foreground">
              <Link href="/">
                <Home className="size-4" />
                Accueil <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
