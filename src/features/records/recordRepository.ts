import { getDb } from '@/core/db/database';
import type { HealthRecord, NewHealthRecord, SortOption } from './types';

// health_records table
const COLUMNS = 'id, date, steps, calories, water';

const ORDER_BY: Record<SortOption, string> = {
  newest: 'date DESC, id DESC',
  oldest: 'date ASC, id ASC',
  mostSteps: 'steps DESC, date DESC',
};

// records with date search 
export async function getRecords(dateSearch = '', sort: SortOption = 'newest'): Promise<HealthRecord[]> {
  const db = await getDb();
  const prefix = dateSearch.replace(/[^0-9-]/g, '');    // dates include only digits and dashes
  return db.getAllAsync<HealthRecord>(
    `SELECT ${COLUMNS} FROM health_records WHERE date LIKE ? ORDER BY ${ORDER_BY[sort]}`,
    `${prefix}%`,
  );
}

// get a single record by id
export async function getRecordById(id: number): Promise<HealthRecord | null> {
  const db = await getDb();
  return db.getFirstAsync<HealthRecord>(`SELECT ${COLUMNS} FROM health_records WHERE id = ?`, id);
}

// saving a new record
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

//updating record
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

// deleting a record by id
export async function deleteRecord(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM health_records WHERE id = ?', id);
}
