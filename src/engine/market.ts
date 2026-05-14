/* ================================================================
 * BRIGADE MOBILE — Market Intelligence Module
 * Gère : demande du marché, ancienneté, ajustement stockage
 * ================================================================ */

import type { DemandLevel, CoefficientEntry } from './types.ts';

/** Coefficient de demande : plus la demande est forte, moins on décote */
const DEMAND_MULTIPLIERS: Record<DemandLevel, number> = {
  'tres-forte': 1.08,   // +8% — très recherché
  'forte':      1.03,   // +3%
  'moyenne':    1.00,   // base
  'faible':     0.92,   // -8%
  'tres-faible': 0.82,  // -18%
};

/** Demande par modèle (configuré manuellement, peut être piloté par API) */
const MODEL_DEMAND: Record<string, DemandLevel> = {
  // Apple
  'iphone-15-pro-max': 'tres-forte',
  'iphone-15-pro':     'tres-forte',
  'iphone-15':         'forte',
  'iphone-14-pro-max': 'forte',
  'iphone-14-pro':     'forte',
  'iphone-14':         'moyenne',
  'iphone-13':         'moyenne',
  'iphone-12':         'faible',
  'iphone-11':         'faible',
  'iphone-se-2022':    'tres-faible',
  // Samsung
  'galaxy-s24-ultra':  'tres-forte',
  'galaxy-s24-plus':   'forte',
  'galaxy-s24':        'forte',
  'galaxy-s23-ultra':  'forte',
  'galaxy-s23':        'moyenne',
  'galaxy-s22':        'faible',
  'galaxy-z-flip5':    'forte',
  'galaxy-z-fold5':    'forte',
  'galaxy-a54':        'faible',
  // Google
  'pixel-8-pro':       'moyenne',
  'pixel-8':           'moyenne',
  'pixel-7-pro':       'faible',
  'pixel-7':           'faible',
  // Xiaomi
  'xiaomi-14-ultra':   'moyenne',
  'xiaomi-14':         'moyenne',
  'xiaomi-13t-pro':    'faible',
  'redmi-note-13-pro': 'faible',
  // Huawei
  'huawei-p60-pro':    'tres-faible',
  'huawei-mate-60-pro':'faible',
};

/** Année de sortie par modèle */
const MODEL_RELEASE_YEAR: Record<string, number> = {
  'iphone-15-pro-max': 2023, 'iphone-15-pro': 2023, 'iphone-15': 2023,
  'iphone-14-pro-max': 2022, 'iphone-14-pro': 2022, 'iphone-14': 2022,
  'iphone-13': 2021, 'iphone-12': 2020, 'iphone-11': 2019, 'iphone-se-2022': 2022,
  'galaxy-s24-ultra': 2024, 'galaxy-s24-plus': 2024, 'galaxy-s24': 2024,
  'galaxy-s23-ultra': 2023, 'galaxy-s23': 2023, 'galaxy-s22': 2022,
  'galaxy-z-flip5': 2023, 'galaxy-z-fold5': 2023, 'galaxy-a54': 2023,
  'pixel-8-pro': 2023, 'pixel-8': 2023, 'pixel-7-pro': 2022, 'pixel-7': 2022,
  'xiaomi-14-ultra': 2024, 'xiaomi-14': 2024, 'xiaomi-13t-pro': 2023, 'redmi-note-13-pro': 2024,
  'huawei-p60-pro': 2023, 'huawei-mate-60-pro': 2023,
};

/** Coefficient d'ancienneté : -5% par année d'âge (plafonné) */
export function getAgeCoefficient(modelId: string): CoefficientEntry {
  const releaseYear = MODEL_RELEASE_YEAR[modelId] || new Date().getFullYear();
  const age = new Date().getFullYear() - releaseYear;
  const decay = Math.min(age * 0.05, 0.25); // max -25%
  return {
    id: 'age',
    label: `Ancienneté (${age} an${age > 1 ? 's' : ''})`,
    value: 1 - decay,
    type: 'percent',
  };
}

/** Coefficient de demande du marché */
export function getDemandCoefficient(modelId: string): CoefficientEntry {
  const level = MODEL_DEMAND[modelId] || 'moyenne';
  const multiplier = DEMAND_MULTIPLIERS[level];
  return {
    id: 'demand',
    label: `Demande ${level.replace('-', ' ')}`,
    value: multiplier,
    type: 'percent',
  };
}

/** Bonus/malus selon le stockage (les grosses capacités se revendent mieux) */
export function getStorageCoefficient(capacity: string): CoefficientEntry {
  const cap = capacity.toLowerCase();
  let mult = 1.0;
  let label = 'Stockage standard';

  if (cap.includes('1 to') || cap.includes('1to')) {
    mult = 1.06; label = 'Stockage premium (1 To)';
  } else if (cap.includes('512')) {
    mult = 1.03; label = 'Stockage élevé (512 Go)';
  } else if (cap.includes('256')) {
    mult = 1.00; label = 'Stockage standard (256 Go)';
  } else if (cap.includes('128')) {
    mult = 0.97; label = 'Stockage faible (128 Go)';
  } else if (cap.includes('64')) {
    mult = 0.92; label = 'Stockage très faible (64 Go)';
  }

  return { id: 'storage', label, value: mult, type: 'percent' };
}

/** Calcule le prix marché ajusté en fonction de la demande, ancienneté et stockage */
export function getAdjustedMarketPrice(
  basePrice: number,
  modelId: string,
  capacity: string,
  enableDemand: boolean = true,
  enableAge: boolean = true,
): { adjusted: number; demand: CoefficientEntry; age: CoefficientEntry; storage: CoefficientEntry } {
  const demand = getDemandCoefficient(modelId);
  const age = getAgeCoefficient(modelId);
  const storage = getStorageCoefficient(capacity);

  let adjusted = basePrice;
  if (enableDemand) adjusted *= demand.value;
  if (enableAge) adjusted *= age.value;
  adjusted *= storage.value;

  return {
    adjusted: Math.round(adjusted),
    demand,
    age,
    storage,
  };
}

/** Récupère l'année de sortie d'un modèle */
export function getReleaseYear(modelId: string): number {
  return MODEL_RELEASE_YEAR[modelId] || new Date().getFullYear();
}
