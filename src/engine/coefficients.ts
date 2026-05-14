/* ================================================================
 * BRIGADE MOBILE — Coefficients Module
 * Tous les coefficients de déduction (état + défauts)
 * ================================================================ */

import type { Condition, DeviceInspection, CoefficientEntry, EngineConfig } from './types.ts';

/** Configuration par défaut du moteur */
export const DEFAULT_CONFIG: EngineConfig = {
  minMargin: 200,          // 200€ minimum de bénéfice
  minPrice: 0,             // Pas de prix négatif
  casseMaxRatio: 0.12,     // 12% max récupérable sur un cassé
  enableDemandAdjust: true,
  enableAgeAdjust: true,
  costs: {
    logistics: 15,         // Envoi + réception
    inspection: 10,        // Test qualité
    sav: 25,               // Provision garantie/retours
    fraudRiskBase: 20,     // Risque fraude de base
  },
  monthlyDepreciation: 0.02, // -2% par mois
  monthsToResale: 1.5,       // Délai moyen avant revente
};

/** Décote fixe selon l'état cosmétique */
const CONDITION_DEDUCTIONS: Record<Condition, number> = {
  'neuf':       200,
  'comme-neuf': 220,
  'tres-bon':   250,
  'bon':        320,
  'correct':    400,
  'casse':      0,   // Calculé dynamiquement
};

const CONDITION_LABELS: Record<Condition, string> = {
  'neuf':       'Neuf — sous blister',
  'comme-neuf': 'Comme neuf — parfait',
  'tres-bon':   'Très bon état',
  'bon':        'Bon état',
  'correct':    'État correct',
  'casse':      'Cassé / HS',
};

/** Retourne le coefficient d'état */
export function getConditionCoefficient(
  condition: Condition,
  adjustedMarketPrice: number,
  config: EngineConfig = DEFAULT_CONFIG,
): CoefficientEntry {
  if (condition === 'casse') {
    const deduction = Math.round(adjustedMarketPrice * (1 - config.casseMaxRatio));
    return {
      id: 'condition',
      label: CONDITION_LABELS.casse,
      value: deduction,
      type: 'fixed',
    };
  }
  return {
    id: 'condition',
    label: CONDITION_LABELS[condition],
    value: CONDITION_DEDUCTIONS[condition],
    type: 'fixed',
  };
}

/** Déductions fixes par défaut technique */
const DEFECT_RULES: {
  key: keyof DeviceInspection;
  trigger: (v: any) => boolean;
  entry: CoefficientEntry;
}[] = [
  {
    key: 'batteryHealth',
    trigger: (v: number) => v < 85,
    entry: { id: 'battery', label: 'Batterie < 85%', value: 50, type: 'fixed' },
  },
  {
    key: 'screenOriginal',
    trigger: (v: boolean) => !v,
    entry: { id: 'screen', label: 'Écran remplacé (non original)', value: 70, type: 'fixed' },
  },
  {
    key: 'biometricWorks',
    trigger: (v: boolean) => !v,
    entry: { id: 'biometric', label: 'Face ID / Touch ID non fonctionnel', value: 90, type: 'fixed' },
  },
  {
    key: 'backGlassBroken',
    trigger: (v: boolean) => v,
    entry: { id: 'back_glass', label: 'Dos cassé (vitre arrière)', value: 60, type: 'fixed' },
  },
  {
    key: 'unlocked',
    trigger: (v: boolean) => !v,
    entry: { id: 'locked', label: 'Bloqué opérateur', value: 40, type: 'fixed' },
  },
  {
    key: 'imeiClean',
    trigger: (v: boolean) => !v,
    entry: { id: 'imei_blacklist', label: 'IMEI blacklisté', value: 150, type: 'fixed' },
  },
  {
    key: 'hasCharger',
    trigger: (v: boolean) => !v,
    entry: { id: 'no_charger', label: 'Chargeur manquant', value: 15, type: 'fixed' },
  },
  {
    key: 'hasBox',
    trigger: (v: boolean) => !v,
    entry: { id: 'no_box', label: 'Boîte manquante', value: 20, type: 'fixed' },
  },
];

/** Détecte et retourne tous les coefficients de défaut applicables */
export function getDefectDeductions(inspection: DeviceInspection): CoefficientEntry[] {
  const deductions: CoefficientEntry[] = [];

  for (const rule of DEFECT_RULES) {
    const value = inspection[rule.key];
    if (rule.trigger(value)) {
      // Batterie dégradée : ajuster selon le % réel
      if (rule.key === 'batteryHealth') {
        const health = value as number;
        let amount = 50; // base
        if (health < 80) amount = 70;
        if (health < 70) amount = 90;
        if (health < 60) amount = 120;
        deductions.push({ ...rule.entry, value: amount, label: `Batterie à ${health}%` });
      } else {
        deductions.push({ ...rule.entry });
      }
    }
  }

  return deductions;
}

/** Retourne la configuration avec surcharges optionnelles */
export function createConfig(overrides?: Partial<EngineConfig>): EngineConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}
