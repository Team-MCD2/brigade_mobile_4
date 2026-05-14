/* ================================================================
 * BRIGADE MOBILE — Pricing Engine Types
 * Architecture modulaire style Back Market
 * ================================================================ */

/** État cosmétique de l'appareil */
export type Condition =
  | 'neuf'
  | 'comme-neuf'
  | 'tres-bon'
  | 'bon'
  | 'correct'
  | 'casse';

/** Demande du marché pour un modèle donné */
export type DemandLevel = 'tres-forte' | 'forte' | 'moyenne' | 'faible' | 'tres-faible';

/** Informations sur l'état physique et technique du device */
export interface DeviceInspection {
  condition: Condition;
  batteryHealth: number;         // 0-100 (% de santé batterie)
  screenOriginal: boolean;
  biometricWorks: boolean;       // Face ID / Touch ID
  unlocked: boolean;             // Débloqué tout opérateur
  imeiClean: boolean;            // Pas blacklisté
  hasCharger: boolean;
  hasBox: boolean;
  backGlassBroken: boolean;      // Dos cassé (verre)
}

/** Identifiant complet du device pour le moteur de prix */
export interface DeviceIdentifier {
  brandId: string;
  modelId: string;
  capacity: string;
  releaseYear: number;           // Année de sortie du modèle
}

/** Coefficient nommé avec sa valeur */
export interface CoefficientEntry {
  id: string;
  label: string;
  value: number;                 // Montant en € ou multiplicateur
  type: 'fixed' | 'percent';    // Déduction fixe en € ou % du prix marché
}

/** Résultat détaillé du calcul de reprise */
export interface PricingBreakdown {
  /** Identification */
  deviceId: DeviceIdentifier;
  timestamp: string;

  /** Prix de base */
  marketPrice: number;
  adjustedMarketPrice: number;
  futureResaleValue: number;       // Valeur revente future estimée

  /** Coefficients appliqués */
  conditionCoeff: CoefficientEntry;
  demandCoeff: CoefficientEntry;
  ageCoeff: CoefficientEntry;
  storageCoeff: CoefficientEntry;
  defectDeductions: CoefficientEntry[];

  /** Coûts opérationnels */
  operationalCosts: {
    repair: number;                // Coût réparation estimé
    logistics: number;             // Coût logistique (envoi, réception)
    inspection: number;            // Coût inspection qualité
    sav: number;                   // Coût SAV (garantie, retours)
    fraudRisk: number;             // Coût risque fraude
    marketDepreciation: number;    // Dépréciation marché prévue
    aiDecote: number;              // Décote basée sur l'analyse IA
    total: number;                 // Total des coûts opérationnels
  };

  /** Totaux */
  totalConditionDeduction: number;
  totalDefectDeduction: number;
  totalDecote: number;

  /** Marge */
  minMargin: number;
  effectiveMargin: number;

  /** Prix final */
  rawPrice: number;
  finalPrice: number;

  /** Rentabilité */
  profitability: {
    score: number;                 // 0-100 (100 = très rentable)
    level: 'excellent' | 'good' | 'fair' | 'poor' | 'loss';
    estimatedProfit: number;       // Bénéfice estimé en €
    roi: number;                   // Retour sur investissement en %
  };

  /** Risque */
  riskScore: number;               // 0-100 (0 = aucun risque)

  /** Meta */
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
}

/** Configuration globale du moteur */
export interface EngineConfig {
  minMargin: number;             // Marge minimum en €
  minPrice: number;              // Prix plancher en €
  casseMaxRatio: number;         // % max récupérable sur un cassé
  enableDemandAdjust: boolean;
  enableAgeAdjust: boolean;
  /** Coûts opérationnels fixes */
  costs: {
    logistics: number;           // Frais envoi/réception
    inspection: number;          // Coût inspection qualité
    sav: number;                 // Provision SAV/garantie
    fraudRiskBase: number;       // Coût risque fraude de base
  };
  /** Dépréciation marché mensuelle en % */
  monthlyDepreciation: number;
  /** Nombre de mois avant revente estimé */
  monthsToResale: number;
}

/** Entrée pour l'historique */
export interface HistoryEntry {
  id: string;
  breakdown: PricingBreakdown;
  createdAt: string;
}
