import { getDb } from '@/core/db/database';
import type { HealthRecord } from './types';

// health_records table
const COLUMNS = 'id, date, steps, calories, water';

// records newest first
export async function getRecords(): Promise<HealthRecord[]> {
  const db = await getDb();
  return db.getAllAsync<HealthRecord>(`SELECT ${COLUMNS} FROM health_records ORDER BY date DESC, id DESC`);
}