import type { APIRoute } from 'astro';
import { calculate, calculateSimple, recordCalculation, getHistory, getStats } from '../../engine';
import type { DeviceIdentifier, DeviceInspection, EngineConfig } from '../../engine';
import { brands } from '../../data/phones';

export const prerender = false;

/**
 * POST /api/reprise-estimate
 *
 * Body (mode complet) :
 * {
 *   "brandId": "apple",
 *   "modelId": "iphone-15-pro",
 *   "capacity": "256 Go",
 *   "inspection": {
 *     "condition": "tres-bon",
 *     "batteryHealth": 87,
 *     "screenOriginal": true,
 *     "biometricWorks": true,
 *     "unlocked": true,
 *     "imeiClean": true,
 *     "hasCharger": true,
 *     "hasBox": false,
 *     "backGlassBroken": false
 *   }
 * }
 *
 * Body (mode simple — compatible front) :
 * {
 *   "modelId": "iphone-15-pro",
 *   "capacity": "256 Go",
 *   "condition": "tres-bon",
 *   "batteryChanged": false,
 *   "screenOriginal": true,
 *   "biometricWorks": true,
 *   "unlocked": true,
 *   "hasCharger": true,
 *   "hasBox": false
 * }
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Résoudre le prix marché
    const brandId = body.brandId || '';
    const modelId = body.modelId;
    const capacity = body.capacity;

    if (!modelId || !capacity) {
      return json({ error: 'modelId et capacity sont requis' }, 400);
    }

    // Trouver le prix marché dans la base
    let marketPrice = body.marketPrice;
    if (!marketPrice) {
      for (const brand of brands) {
        const model = brand.models.find(m => m.id === modelId);
        if (model) {
          marketPrice = model.marketPrice[capacity];
          break;
        }
      }
    }

    if (!marketPrice) {
      return json({ error: `Modèle ou capacité introuvable: ${modelId} / ${capacity}` }, 404);
    }

    let breakdown;

    if (body.inspection) {
      // Mode complet
      const device: DeviceIdentifier = {
        brandId,
        modelId,
        capacity,
        releaseYear: 0,
      };
      const inspection: DeviceInspection = body.inspection;
      const config: Partial<EngineConfig> = body.config || {};
      breakdown = calculate(marketPrice, device, inspection, { ...{ minMargin: 200, minPrice: 0, casseMaxRatio: 0.12, enableDemandAdjust: true, enableAgeAdjust: true }, ...config });
    } else {
      // Mode simple
      breakdown = calculateSimple(
        marketPrice,
        modelId,
        capacity,
        body.condition || 'bon',
        {
          batteryChanged: body.batteryChanged ?? false,
          screenOriginal: body.screenOriginal ?? true,
          biometricWorks: body.biometricWorks ?? true,
          unlocked: body.unlocked ?? true,
          hasCharger: body.hasCharger ?? true,
          hasBox: body.hasBox ?? true,
        },
      );
    }

    // Enregistrer dans l'historique
    const entry = recordCalculation(breakdown);

    return json({
      id: entry.id,
      marketPrice: breakdown.marketPrice,
      adjustedMarketPrice: breakdown.adjustedMarketPrice,
      conditionDeduction: breakdown.totalConditionDeduction,
      defectDeductions: breakdown.defectDeductions.map(d => ({ label: d.label, amount: d.value })),
      totalDecote: breakdown.totalDecote,
      margin: breakdown.effectiveMargin,
      minMargin: breakdown.minMargin,
      finalPrice: breakdown.finalPrice,
      confidence: breakdown.confidence,
      warnings: breakdown.warnings,
      coefficients: {
        demand: { label: breakdown.demandCoeff.label, value: breakdown.demandCoeff.value },
        age: { label: breakdown.ageCoeff.label, value: breakdown.ageCoeff.value },
        storage: { label: breakdown.storageCoeff.label, value: breakdown.storageCoeff.value },
        condition: { label: breakdown.conditionCoeff.label, value: breakdown.conditionCoeff.value },
      },
    });
  } catch (err: any) {
    console.error('[reprise-estimate] Error:', err);
    return json({ error: err.message || 'Erreur serveur' }, 500);
  }
};

/**
 * GET /api/reprise-estimate?action=history|stats
 */
export const GET: APIRoute = async ({ url }) => {
  const action = url.searchParams.get('action') || 'stats';

  if (action === 'history') {
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    return json(getHistory(limit, offset));
  }

  if (action === 'stats') {
    return json(getStats());
  }

  return json({ error: 'Action inconnue. Utilisez ?action=history ou ?action=stats' }, 400);
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
