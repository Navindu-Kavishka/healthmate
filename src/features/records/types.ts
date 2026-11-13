export type HealthRecord = {
  id: number;
  date: string;     // "YYYY-MM-DD"
  steps: number;
  calories: number;  // kcal
  water: number;   // ml
};

//record not saved yet  ( SQLite hasn't given it an id.) 
export type NewHealthRecord = Omit<HealthRecord, 'id'>;

// history list ordering
export type SortOption = 'newest' | 'oldest' | 'mostSteps';