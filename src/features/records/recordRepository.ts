import { getDb } from '@/core/db/database';
import { EMPTY_TOTALS, type DayTotals, type HealthRecord, type NewHealthRecord, type SortOption, type Totals } from './types';


const COLUMNS = 'id, date, steps, calories, water';

// ORDER BY can't take a ? placeholder, only these fixed strings are ever used.
const ORDER_BY: Record<SortOption, string> = {
  newest: 'date DESC, id DESC',
  oldest: 'date ASC, id ASC',
  mostSteps: 'steps DESC, date DESC',
};

//All records whose date starts with `dateSearch` ("2026", "2026-11", "2026-11-07")
export async function getRecords(dateSearch = '', sort: SortOption = 'newest'): Promise<HealthRecord[]> {
  const db = await getDb();
  const prefix = dateSearch.replace(/[^0-9-]/g, ''); // dates only hold digits and dashes
  return db.getAllAsync<HealthRecord>(
    `SELECT ${COLUMNS} FROM health_records WHERE date LIKE ? ORDER BY ${ORDER_BY[sort]}`,
    `${prefix}%`,
  );
}

export async function getRecordById(id: number): Promise<HealthRecord | null> {
  const db = await getDb();
  return db.getFirstAsync<HealthRecord>(`SELECT ${COLUMNS} FROM health_records WHERE id = ?`, id);
}

// Saves a new record and returns the id
export async function addRecord(record: NewHealthRecord): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    'INSERT INTO health_records (date, steps, calories, water) VALUES (?, ?, ?, ?)',
    record.date,
    record.steps,
    record.calories,
    record.water,
  );
  return result.lastInsertRowId;
}

// Update an existing record
export async function updateRecord(record: HealthRecord): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE health_records SET date = ?, steps = ?, calories = ?, water = ? WHERE id = ?',
    record.date,
    record.steps,
    record.calories,
    record.water,
    record.id,
  );
}

// Delete a record by id
export async function deleteRecord(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM health_records WHERE id = ?', id);
}

// Add up every entry for one date. COALESCE turns "no rows" (NULL) into 0
export async function getTotalsForDate(date: string): Promise<Totals> {
  const db = await getDb();
  const row = await db.getFirstAsync<Totals>(
    `SELECT COALESCE(SUM(steps), 0)    AS steps,
            COALESCE(SUM(calories), 0) AS calories,
            COALESCE(SUM(water), 0)    AS water
     FROM health_records
     WHERE date = ?`,
    date,
  );
  return row ?? EMPTY_TOTALS;
}

// One row per date between the two dates (inclusive). Dates with no entries are missing.
export async function getDailyTotals(fromDate: string, toDate: string): Promise<DayTotals[]> {
  const db = await getDb();
  return db.getAllAsync<DayTotals>(
    `SELECT date,
            SUM(steps)    AS steps,
            SUM(calories) AS calories,
            SUM(water)    AS water
     FROM health_records
     WHERE date BETWEEN ? AND ?
     GROUP BY date
     ORDER BY date`,
    fromDate,
    toDate,
  );
}