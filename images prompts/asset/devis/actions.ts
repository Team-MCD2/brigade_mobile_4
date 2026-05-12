"use server";

import { randomBytes } from "crypto";

import { computeQuoteTotal } from "@/lib/data/repairCatalog";
import { PICKUP_MODE_META, type PickupModeId } from "@/lib/data/pickupModes";
import { REPAIR_LABELS, type RepairId } from "@/lib/data/repairs";
import { quoteSubmitSchema, type QuoteSubmitInput } from "@/lib/devis/schemas";
import { siteConfig } from "@/lib/site-config";

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildQuoteEmailHtml(
  payload: QuoteSubmitInput,
  ref: string,
  total: number,
  quote: ReturnType<typeof computeQuoteTotal>,
) {
  const pickup = PICKUP_MODE_META[payload.pickupMode as PickupModeId];
  const repairs = payload.repairs.map((r) => REPAIR_LABELS[r as RepairId]?.label ?? r).join(", ");
  const linesDetail = quote.lines
    .map((l) => {
      const hint = quote.marketHints.find((h) => h.id === l.id);
      const extra = hint ? ` — ailleurs (même réparation, est.) ${escapeHtml(hint.band)}` : "";
      return `<li>${escapeHtml(l.label)} : <strong>${l.price} €</strong>${extra}</li>`;
    })
    .join("");
  return `
  <h1>Nouveau devis ${escapeHtml(ref)}</h1>
  <p><strong>Contact :</strong> ${escapeHtml(payload.contact.name)} — ${escapeHtml(payload.contact.email)} — ${escapeHtml(payload.contact.phone)}</p>
  <p><strong>Catégorie :</strong> ${escapeHtml(payload.category)} · <strong>Marque :</strong> ${escapeHtml(payload.brandId)} · <strong>Modèle :</strong> ${escapeHtml(payload.modelId)}</p>
  <p><strong>Pannes :</strong> ${escapeHtml(repairs)}</p>
  <p><strong>Mode :</strong> ${escapeHtml(pickup.title)} (+${pickup.priceEuro} €)</p>
  <p><strong>RDV / envoi :</strong> ${escapeHtml(payload.appointmentDate)} ${escapeHtml(payload.appointmentSlot ?? "")}</p>
  <p><strong>Adresse :</strong> ${escapeHtml(payload.contact.address ?? "")} ${escapeHtml(payload.contact.postalCode ?? "")} ${escapeHtml(payload.contact.city ?? "")}</p>
  <p><strong>Notes :</strong> ${escapeHtml(payload.contact.notes ?? "")}</p>
  <p><strong>Total indicatif TTC :</strong> ${total} € (à confirmer après diagnostic gratuit)</p>
  <p><strong>Détail &amp; contexte marché :</strong></p>
  <ul>${linesDetail}</ul>
  <p style="font-size:12px;color:#666;">Fourchettes « prix ailleurs pour la même réparation » — indicatives, non contractuelles.</p>
  `;
}

export async function submitQuote(raw: unknown): Promise<{ ok: true; ref: string } | { ok: false; error: string }> {
  const parsed = quoteSubmitSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(" ") || "Données invalides" };
  }
  const data = parsed.data;
  const quote = computeQuoteTotal({
    modelId: data.modelId === "unknown" ? null : data.modelId,
    category: data.category,
    repairs: data.repairs,
    pickup: data.pickupMode,
  });
  const ref = `BM-${randomBytes(4).toString("hex").toUpperCase()}`;
  const total = quote.total;

  const html = buildQuoteEmailHtml(data, ref, total, quote);
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL ?? siteConfig.contact.email;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM ?? "La Brigade Mobile <onboarding@resend.dev>",
          to: [to],
          reply_to: data.contact.email,
          subject: `[Devis ${ref}] ${data.contact.name} — ${total} € (indicatif)`,
          html,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        console.error("Resend error", res.status, t);
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    console.info("[submitQuote] RESEND_API_KEY manquant — email non envoyé", { ref, to });
  }

  return { ok: true, ref };
}
