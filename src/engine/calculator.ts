/* ================================================================
 * BRIGADE MOBILE — Main Pricing Calculator
 * Orchestre tous les modules pour calculer le prix final
 * ================================================================ */

import type {
  DeviceIdentifier,
  DeviceInspection,
  PricingBreakdown,
  EngineConfig,
} from './types.ts';
import { getAdjustedMarketPrice, getReleaseYear } from './market.ts';
import { getConditionCoefficient, getDefectDeductions, DEFAULT_CONFIG } from './coefficients.ts';

/**
 * Calcule le prix de reprise complet avec tous les coefficients.
 *
 * Pipeline :
 * 1. Prix marché de base (neuf)
 * 2. Ajustement marché (demande + ancienneté + stockage)
 * 3. Estimation valeur revente future
 * 4. Décote état cosmétique
 * 5. Déductions défauts techniques
 * 6. Coûts opérationnels (logistique, inspection, SAV, fraude)
 * 7. Coût réparation estimé
 * 8. Dépréciation marché prévue
 * 9. Vérification marge minimale
 * 10. Score de rentabilité
 */
export function calculate(
  marketPrice: number,
  device: DeviceIdentifier,
  inspection: DeviceInspection,
  config: EngineConfig = DEFAULT_CONFIG,
  aiScore?: number,
): PricingBreakdown {
  const warnings: string[] = [];

  // 1. Prix marché ajusté
  const { adjusted, demand, age, storage } = getAdjustedMarketPrice(
    marketPrice,
    device.modelId,
    device.capacity,
    config.enableDemandAdjust,
    config.enableAgeAdjust,
  );

  // 2. Estimation valeur revente future
  const depreciationRate = config.monthlyDepreciation * config.monthsToResale;
  const futureResaleValue = Math.round(adjusted * (1 - depreciationRate));

  // 3. Coefficient d'état
  const conditionCoeff = getConditionCoefficient(inspection.condition, adjusted, config);
  const totalConditionDeduction = conditionCoeff.value;

  // 4. Défauts techniques
  const defectDeductions = getDefectDeductions(inspection);
  const totalDefectDeduction = defectDeductions.reduce((sum, d) => sum + d.value, 0);

  // 5. Coûts opérationnels
  const repairCost = estimateRepairCost(inspection);
  const fraudRisk = calculateFraudRisk(inspection, config);
  const marketDepreciation = Math.round(adjusted * depreciationRate);
  const aiDecote = aiScore != null ? Math.round(Math.max(0, (100 - aiScore) * 0.5)) : 0;

  const operationalCosts = {
    repair: repairCost,
    logistics: config.costs.logistics,
    inspection: config.costs.inspection,
    sav: config.costs.sav,
    fraudRisk,
    marketDepreciation,
    aiDecote,
    total: repairCost + config.costs.logistics + config.costs.inspection + config.costs.sav + fraudRisk + marketDepreciation + aiDecote,
  };

  // 6. Décote totale
  const totalDecote = totalConditionDeduction + totalDefectDeduction;

  // 7. Prix brut = valeur revente - marge - décotes - coûts
  const rawPrice = futureResaleValue - totalDecote - operationalCosts.total;

  // 8. Marge effective et prix final
  const minMargin = config.minMargin;
  let finalPrice: number;

  if (inspection.condition === 'casse') {
    finalPrice = Math.max(0, Math.round(adjusted * config.casseMaxRatio - operationalCosts.total));
  } else {
    // S'assurer que la marge minimum est respectée
    const maxOffer = futureResaleValue - minMargin - operationalCosts.total;
    finalPrice = Math.max(config.minPrice, Math.min(rawPrice, maxOffer));
  }

  finalPrice = Math.round(Math.max(0, finalPrice));
  const effectiveMargin = futureResaleValue - finalPrice - operationalCosts.total;

  // 9. Score de risque
  const riskScore = calculateRiskScore(inspection, aiScore);

  // 10. Rentabilité
  const estimatedProfit = futureResaleValue - finalPrice - operationalCosts.total;
  const roi = finalPrice > 0 ? Math.round((estimatedProfit / finalPrice) * 100) : 0;
  let profitLevel: 'excellent' | 'good' | 'fair' | 'poor' | 'loss';
  if (roi >= 60) profitLevel = 'excellent';
  else if (roi >= 40) profitLevel = 'good';
  else if (roi >= 20) profitLevel = 'fair';
  else if (roi >= 0) profitLevel = 'poor';
  else profitLevel = 'loss';

  const profitScore = Math.min(100, Math.max(0, roi));

  // Warnings
  if (!inspection.imeiClean) warnings.push('IMEI blacklisté — vérification requise');
  if (inspection.batteryHealth < 60) warnings.push(`Batterie critique : ${inspection.batteryHealth}%`);
  if (finalPrice < 30) warnings.push('Reprise potentiellement non rentable');
  if (riskScore > 60) warnings.push(`Risque élevé (${riskScore}/100)`);
  if (effectiveMargin < minMargin && inspection.condition !== 'casse') warnings.push(`Marge ajustée : ${Math.round(effectiveMargin)}€ < ${minMargin}€`);
  if (profitLevel === 'loss') warnings.push('Opération déficitaire');

  let confidence: 'high' | 'medium' | 'low' = 'high';
  if (warnings.length >= 3) confidence = 'low';
  else if (warnings.length >= 1) confidence = 'medium';

  return {
    deviceId: { ...device, releaseYear: getReleaseYear(device.modelId) },
    timestamp: new Date().toISOString(),
    marketPrice,
    adjustedMarketPrice: adjusted,
    futureResaleValue,
    conditionCoeff,
    demandCoeff: demand,
    ageCoeff: age,
    storageCoeff: storage,
    defectDeductions,
    operationalCosts,
    totalConditionDeduction,
    totalDefectDeduction,
    totalDecote,
    minMargin,
    effectiveMargin: Math.round(effectiveMargin),
    rawPrice: Math.round(rawPrice),
    finalPrice,
    profitability: {
      score: profitScore,
      level: profitLevel,
      estimatedProfit: Math.round(estimatedProfit),
      roi,
    },
    riskScore,
    confidence,
    warnings,
  };
}

/** Estime le coût de réparation selon l'état */
function estimateRepairCost(inspection: DeviceInspection): number {
  let cost = 0;
  if (!inspection.screenOriginal) cost += 35;
  if (inspection.backGlassBroken) cost += 25;
  if (inspection.batteryHealth < 80) cost += 30;
  if (!inspection.biometricWorks) cost += 45;
  return cost;
}

/** Calcule le coût de risque fraude */
function calculateFraudRisk(inspection: DeviceInspection, config: EngineConfig): number {
  let risk = config.costs.fraudRiskBase;
  if (!inspection.imeiClean) risk += 80;
  if (!inspection.unlocked) risk += 15;
  return risk;
}

/** Calcule un score de risque global 0-100 */
function calculateRiskScore(inspection: DeviceInspection, aiScore?: number): number {
  let risk = 0;
  if (!inspection.imeiClean) risk += 40;
  if (!inspection.screenOriginal) risk += 10;
  if (!inspection.biometricWorks) risk += 15;
  if (!inspection.unlocked) risk += 10;
  if (inspection.batteryHealth < 70) risk += 10;
  if (inspection.backGlassBroken) risk += 5;
  if (aiScore != null && aiScore < 40) risk += 10;
  return Math.min(100, risk);
}

/**
 * Version simplifiée pour le front-end (compatible avec l'ancien format).
 * Utilise des booléens au lieu de valeurs précises pour la batterie.
 */
export function calculateSimple(
  marketPrice: number,
  modelId: string,
  capacity: string,
  condition: DeviceInspection['condition'],
  state: {
    batteryChanged: boolean;
    screenOriginal: boolean;
    biometricWorks: boolean;
    unlocked: boolean;
    hasCharger: boolean;
    hasBox: boolean;
  },
  config?: Partial<EngineConfig>,
): PricingBreakdown {
  const device: DeviceIdentifier = {
    brandId: '',
    modelId,
    capacity,
    releaseYear: getReleaseYear(modelId),
  };

  const inspection: DeviceInspection = {
    condition,
    batteryHealth: state.batteryChanged ? 78 : 92,
    screenOriginal: state.screenOriginal,
    biometricWorks: state.biometricWorks,
    unlocked: state.unlocked,
    imeiClean: true,
    hasCharger: state.hasCharger,
    hasBox: state.hasBox,
    backGlassBroken: false,
  };

  return calculate(marketPrice, device, inspection, { ...DEFAULT_CONFIG, ...config });
}
