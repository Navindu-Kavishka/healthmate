export type HealthRecord = {
  id: number;
  date: string;     // "YYYY-MM-DD"
  steps: number;
  calories: number;  // kcal
  water: number;   // ml
};

/** A record that hasn't been saved yet, so SQLite hasn't given it an id. */
export type NewHealthRecord = Omit<HealthRecord, 'id'>;