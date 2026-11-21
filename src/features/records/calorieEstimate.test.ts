import { estimateCalories, KCAL_PER_STEP } from './calorieEstimate';

describe('estimateCalories', () => {
  it('turns steps into the documented rate', () => {
    expect(KCAL_PER_STEP).toBe(0.04);
    expect(estimateCalories(7_850)).toBe(314);
    expect(estimateCalories(10_000)).toBe(400);
  });

  it('rounds to whole kilocalories', () => {
    expect(estimateCalories(1_000)).toBe(40);
    expect(estimateCalories(1_234)).toBe(49);
  });

  it('scales with body mass around the 70 kg rate', () => {
    expect(estimateCalories(10_000, 70)).toBe(400);
    expect(estimateCalories(10_000, 85)).toBe(486);
  });

  it('returns 0 when there is nothing to estimate', () => {
    expect(estimateCalories(0)).toBe(0);
    expect(estimateCalories(-500)).toBe(0);
    expect(estimateCalories(Number.NaN)).toBe(0);
  });
});