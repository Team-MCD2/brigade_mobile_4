/* ================================================================
 * BRIGADE MOBILE — Pricing Facade
 * Façade légère qui délègue au moteur de pricing engine/
 * Garde la compatibilité avec le front-end existant
 * ================================================================ */

import { calculateSimple } from '../engine';
import type { Condition, PricingBreakdown } from '../engine';

export type { Condition } from '../engine';

export interface DeviceState {
  condition: Condition;
  batteryChanged: boolean;
  screenOriginal: boolean;
  biometricWorks: boolean;
  unlocked: boolean;
  hasCharger: boolean;
  hasBox: boolean;
}

export interface PricingResult {
  marketPrice: number;
  adjustedMarketPrice: number;
  futureResaleValue: number;
  conditionDeduction: number;
  defectDeductions: { label: string; amount: number }[];
  operationalCosts: {
    repair: number;
    logistics: number;
    inspection: number;
    sav: number;
    fraudRisk: number;
    marketDepreciation: number;
    aiDecote: number;
    total: number;
  };
  totalDecote: number;
  margin: number;
  finalPrice: number;
  profitability: {
    score: number;
    level: 'excellent' | 'good' | 'fair' | 'poor' | 'loss';
    estimatedProfit: number;
    roi: number;
  };
  riskScore: number;
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
  coefficients: {
    demand: { label: string; value: number };
    age: { label: string; value: number };
    storage: { label: string; value: number };
  };
  _raw: PricingBreakdown;
}

/**
 * Calcule le prix de reprise via le moteur intelligent.
 */
export function calculateReprise(
  marketPrice: number,
  state: DeviceState,
  modelId: string = '',
  capacity: string = '',
  aiScore?: number,
): PricingResult {
  const breakdown = calculateSimple(
    marketPrice,
    modelId,
    capacity,
    state.condition,
    {
      batteryChanged: state.batteryChanged,
      screenOriginal: state.screenOriginal,
      biometricWorks: state.biometricWorks,
      unlocked: state.unlocked,
      hasCharger: state.hasCharger,
      hasBox: state.hasBox,
    },
    aiScore
  );

  return {
    marketPrice: breakdown.marketPrice,
    adjustedMarketPrice: breakdown.adjustedMarketPrice,
    futureResaleValue: breakdown.futureResaleValue,
    conditionDeduction: breakdown.totalConditionDeduction,
    defectDeductions: breakdown.defectDeductions.map(d => ({ label: d.label, amount: d.value })),
    operationalCosts: breakdown.operationalCosts,
    totalDecote: breakdown.totalDecote,
    margin: breakdown.effectiveMargin,
    finalPrice: breakdown.finalPrice,
    profitability: breakdown.profitability,
    riskScore: breakdown.riskScore,
    confidence: breakdown.confidence,
    warnings: breakdown.warnings,
    coefficients: {
      demand: { label: breakdown.demandCoeff.label, value: breakdown.demandCoeff.value },
      age: { label: breakdown.ageCoeff.label, value: breakdown.ageCoeff.value },
      storage: { label: breakdown.storageCoeff.label, value: breakdown.storageCoeff.value },
    },
    _raw: breakdown,
  };
}
