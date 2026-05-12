"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { DeviceModel } from "@/lib/data/models";
import { cn } from "@/lib/utils";

export function ModelsSearch({ brandSlug, models }: { brandSlug: string; models: DeviceModel[] }) {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return models;
    return models.filter((m) => m.name.toLowerCase().includes(n) || m.slug.includes(n));
  }, [models, q]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un modèle…"
          className="h-11 rounded-lg pl-10"
          aria-label="Rechercher un modèle"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => {
          const prices = Object.values(m.repairs).filter((x): x is number => typeof x === "number");
          const from = prices.length ? Math.min(...prices) : null;
          return (
            <Link key={m.id} href={`/reparations/${brandSlug}/${m.slug}`}>
              <Card
                className={cn(
                  "h-full rounded-xl border border-border transition-all hover:-translate-y-0.5 hover:border-foreground/15",
                )}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">{m.name}</CardTitle>
                  {from != null && (
                    <p className="font-num text-sm text-muted-foreground">
                      À partir de <span className="font-medium text-foreground">{from} €</span>
                    </p>
                  )}
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">Aucun modèle ne correspond — essayez un autre terme.</p>
      )}
    </div>
  );
}
