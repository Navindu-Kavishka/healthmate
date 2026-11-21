import { getDb } from '@/core/db/database';
import { DEFAULT_GOALS, type Goals } from './types';

export async function getGoals(): Promise<Goals> {
  const db = await getDb();
  const row = await db.getFirstAsync<Goals>('SELECT steps, calories, water FROM goals WHERE id = 1');
  return row ?? DEFAULT_GOALS;
}

// "Upsert": inserts row 1 if it's missing, otherwise update it
export async function saveGoals(goals: Goals): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO goals (id, steps, calories, water) VALUES (1, ?, ?, ?)
     ON CONFLICT (id) DO UPDATE SET
       steps = excluded.steps, calories = excluded.calories, water = excluded.water`,
    goals.steps,
    goals.calories,
    goals.water,
  );
}