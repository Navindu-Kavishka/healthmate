import { formatNumber } from '@/core/utils/format';
import { METRICS } from './metrics';
import type { HealthRecord, Totals } from './types';

// adds up the rows on screen, so a filtered list can show its total
export function sumRecords(records: HealthRecord[]): Totals {
  return records.reduce(
    (total, record) => ({
      steps: total.steps + record.steps,
      calories: total.calories + record.calories,
      water: total.water + record.water,
    }),
    { steps: 0, calories: 0, water: 0 },
  );
}

// showing like "18 days · 132,400 steps · 31,200 kcal · 24,800 ml"
export function describeRecords(records: HealthRecord[]): string {
  const totals = sumRecords(records);
  const days = records.length === 1 ? '1 day' : `${records.length} days`;

  return [
    days,
    `${formatNumber(totals.steps)} ${METRICS.steps.unit}`,
    `${formatNumber(totals.calories)} ${METRICS.calories.unit}`,
    `${formatNumber(totals.water)} ${METRICS.water.unit}`,
  ].join(' · ');
}