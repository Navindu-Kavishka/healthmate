import type { Totals } from '@/features/records/types';

// Daily targets - same three numbers as a day's totals
export type Goals = Totals;

export const DEFAULT_GOALS: Goals = { steps: 10_000, calories: 2_500, water: 2_500 };