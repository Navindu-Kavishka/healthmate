import { addDays } from '@/core/utils/dates';
import type { DayTotals } from '@/features/records/types';

// How much of the goal is done, from 0 to 1 (a progress bar can't go past full)
export function progressTowards(value: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(value / goal, 1);
}

//SQL only return dates that have records
// so missing dates are filled in with zeros, oldest first, ending on `endDate`.
export function fillMissingDays(totals: DayTotals[], endDate: string, days = 7): DayTotals[] {
  const totalsByDate = new Map(totals.map((day) => [day.date, day]));

  return Array.from({ length: days }, (_, index) => {
    const date = addDays(endDate, index - (days - 1));
    return totalsByDate.get(date) ?? { date, steps: 0, calories: 0, water: 0 };
  });
}