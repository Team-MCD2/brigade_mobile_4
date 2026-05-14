/* ================================================================
 * BRIGADE MOBILE — Pricing Engine Barrel Export
 * import { calculate, calculateSimple, ... } from '../engine';
 * ================================================================ */

export type {
  Condition,
  DemandLevel,
  DeviceInspection,
  DeviceIdentifier,
  CoefficientEntry,
  PricingBreakdown,
  EngineConfig,
  HistoryEntry,
} from './types.ts';

export { calculate, calculateSimple } from './calculator.ts';
export { getAdjustedMarketPrice, getDemandCoefficient, getAgeCoefficient, getStorageCoefficient, getReleaseYear } from './market.ts';
export { getConditionCoefficient, getDefectDeductions, createConfig, DEFAULT_CONFIG } from './coefficients.ts';
export { recordCalculation, getHistory, getEntryById, getStats, clearHistory } from './history.ts';
