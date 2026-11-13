import { getDb } from '@/core/db/database';
import type { HealthRecord, SortOption } from './types';

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

