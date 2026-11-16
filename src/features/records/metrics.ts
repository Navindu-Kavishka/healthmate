import type { EntryMetric } from './types';

// label, unit, and icon for each metric
export const METRICS: Record<EntryMetric, { label: string; unit: string; icon: string }> = {
  steps: { label: 'Steps', unit: 'steps', icon: 'walk' },
  calories: { label: 'Calories', unit: 'kcal', icon: 'fire' },
  water: { label: 'Water', unit: 'ml', icon: 'cup-water' },
};