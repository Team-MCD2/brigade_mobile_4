/* ================================================================
 * BRIGADE MOBILE — Calculation History
 * Stockage en mémoire des calculs (extensible vers DB/fichier)
 * ================================================================ */

import type { PricingBreakdown, HistoryEntry } from './types.ts';

/** Historique en mémoire (runtime). En production, brancher sur une DB. */
let store: HistoryEntry[] = [];
let counter = 0;

/** Génère un ID unique pour chaque entrée */
function generateId(): string {
  counter++;
  return `calc_${Date.now()}_${counter}`;
}

/** Enregistre un calcul dans l'historique */
export function recordCalculation(breakdown: PricingBreakdown): HistoryEntry {
  const entry: HistoryEntry = {
    id: generateId(),
    breakdown,
    createdAt: new Date().toISOString(),
  };
  store.unshift(entry); // Plus récent en premier

  // Garder les 500 derniers calculs max
  if (store.length > 500) {
    store = store.slice(0, 500);
  }

  return entry;
}

/** Récupère l'historique complet (paginé) */
export function getHistory(limit: number = 50, offset: number = 0): {
  entries: HistoryEntry[];
  total: number;
} {
  return {
    entries: store.slice(offset, offset + limit),
    total: store.length,
  };
}

/** Récupère un calcul par son ID */
export function getEntryById(id: string): HistoryEntry | undefined {
  return store.find(e => e.id === id);
}

/** Statistiques agrégées */
export function getStats(): {
  totalCalculations: number;
  avgFinalPrice: number;
  avgMargin: number;
  topModels: { modelId: string; count: number }[];
  conditionDistribution: Record<string, number>;
} {
  if (store.length === 0) {
    return {
      totalCalculations: 0,
      avgFinalPrice: 0,
      avgMargin: 0,
      topModels: [],
      conditionDistribution: {},
    };
  }

  const total = store.length;
  const sumPrice = store.reduce((s, e) => s + e.breakdown.finalPrice, 0);
  const sumMargin = store.reduce((s, e) => s + e.breakdown.effectiveMargin, 0);

  // Top modèles
  const modelCount: Record<string, number> = {};
  const condCount: Record<string, number> = {};
  for (const e of store) {
    const mid = e.breakdown.deviceId.modelId;
    modelCount[mid] = (modelCount[mid] || 0) + 1;
    const cond = e.breakdown.conditionCoeff.id;
    condCount[e.breakdown.conditionCoeff.label] = (condCount[e.breakdown.conditionCoeff.label] || 0) + 1;
  }

  const topModels = Object.entries(modelCount)
    .map(([modelId, count]) => ({ modelId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalCalculations: total,
    avgFinalPrice: Math.round(sumPrice / total),
    avgMargin: Math.round(sumMargin / total),
    topModels,
    conditionDistribution: condCount,
  };
}

/** Vide l'historique */
export function clearHistory(): void {
  store = [];
  counter = 0;
}
