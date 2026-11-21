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

// The three numbers an entry can change
export type EntryMetric = keyof Totals;

export const ENTRY_METRICS: EntryMetric[] = ['steps', 'calories', 'water'];

// One row of the record_entries table: one thing that happened on a day
export type RecordEntry = {
  id: number;
  recordId: number;      // health_records.id, the day this entry belongs to
  createdAt: string;    // "YYYY-MM-DDTHH:MM:SS"
  metric: EntryMetric;
  amount: number;
  note: string | null;
};

//history list is ordering 
export type SortOption = 'newest' | 'oldest' | 'mostSteps';

export const EMPTY_TOTALS: Totals = { steps: 0, calories: 0, water: 0 };