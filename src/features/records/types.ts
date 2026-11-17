// One row of the health_records table
export type HealthRecord = {
  id: number;
  date: string; // "YYYY-MM-DD"
  steps: number;
  calories: number; // kcal
  water: number; // ml
};

// A record that hasn't been saved yet, so SQLite hasn't given it an id
export type NewHealthRecord = Omit<HealthRecord, 'id'>;

// The three numbers we add up for a day
export type Totals = Pick<HealthRecord, 'steps' | 'calories' | 'water'>;

// totals for one date (one bar on the chart)
export type DayTotals = Totals & { date: string };

//history list is ordering 
export type SortOption = 'newest' | 'oldest' | 'mostSteps';

export const EMPTY_TOTALS: Totals = { steps: 0, calories: 0, water: 0 };