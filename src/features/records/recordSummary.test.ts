import { describeRecords, sumRecords } from './recordSummary';
import type { HealthRecord } from './types';

function record(id: number, date: string, steps: number, calories: number, water: number): HealthRecord {
  return { id, date, steps, calories, water };
}

describe('sumRecords', () => {
  it('adds up nothing to all zeros', () => {
    expect(sumRecords([])).toEqual({ steps: 0, calories: 0, water: 0 });
  });

  it('adds two records field by field', () => {
    const records = [record(1, '2026-11-01', 8_000, 2_400, 1_500), record(2, '2026-11-02', 12_000, 3_600, 2_000)];

    expect(sumRecords(records)).toEqual({ steps: 20_000, calories: 6_000, water: 3_500 });
  });
});

describe('describeRecords', () => {
  it('counts the days and every total', () => {
    const records = [record(1, '2026-11-01', 8_000, 2_400, 1_500), record(2, '2026-11-02', 12_000, 3_600, 2_000)];

    expect(describeRecords(records)).toBe('2 days · 20,000 steps · 6,000 kcal · 3,500 ml');
  });

  it('says "1 day" for a single row', () => {
    expect(describeRecords([record(1, '2026-11-01', 8_000, 2_400, 1_500)])).toBe(
      '1 day · 8,000 steps · 2,400 kcal · 1,500 ml',
    );
  });
});