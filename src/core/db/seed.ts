import type { SQLiteDatabase } from 'expo-sqlite';

import { addDays, todayISO } from '@/core/utils/dates';

const SEED_DAYS = 14;

export async function seedHealthRecords(db: SQLiteDatabase): Promise<void> {
  const today = todayISO();
  const insert = await db.prepareAsync(
    'INSERT INTO health_records (date, steps, calories, water) VALUES (?, ?, ?, ?)',
  );

  try {
    for (let day = 0; day < SEED_DAYS; day++) {
      const date = addDays(today, -day);
      await insert.executeAsync(
        date,
        4000 + ((day * 1733) % 8000),
        1700 + ((day * 97) % 800),
        1200 + ((day * 250) % 1500),
      );

      if (day % 4 === 1) {
        await insert.executeAsync(date, 1500, 300, 500);
      }
    }
  } finally {
    await insert.finalizeAsync();
  }
}