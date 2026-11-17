// Calories burned by walking, from the step count alone.
//
// Derivation (2011 Compendium of Physical Activities, code 17190: walking
// 2.8-3.2 mph on the level at a moderate pace = 3.5 METs; 1 MET = 3.5 ml O2
// per kg per minute, and 1 litre of O2 releases about 5 kcal):
//   kcal/min      = 3.5 METs * 3.5 ml/kg/min * kg / 200 = 0.06125 * kg
//   at 100 steps/min: kcal/step = 0.06125 * kg / 100 = 0.0006125 * kg
// 70 kg therefore gives 0.043 kcal/step. The constant below is that rate
// rounded down to 0.04, so the default estimate stays conservative.
// This is gross energy, like a consumer step counter: it includes the
// calories a resting body would have burned anyway.
export const KCAL_PER_STEP = 0.04;

// The weight the rate above was derived for
export const DEFAULT_WEIGHT_KG = 70;

// Estimated kcal for a walk. Energy scales with body mass, so 70 kg is the reference rate.
export function estimateCalories(steps: number, weightKg = DEFAULT_WEIGHT_KG): number {
  if (!Number.isFinite(steps) || steps <= 0) return 0;
  if (!Number.isFinite(weightKg) || weightKg <= 0) return Math.round(steps * KCAL_PER_STEP);
  return Math.round(steps * KCAL_PER_STEP * (weightKg / DEFAULT_WEIGHT_KG));
}