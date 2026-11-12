import type { SQLiteDatabase } from 'expo-sqlite';

import { seedHealthRecords } from './seed';

type Migration = (db: SQLiteDatabase) => Promise<void>;

const MIGRATIONS: Migration[] = [
  
  async (db) => {
    await db.execAsync(`
      CREATE TABLE health_records (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        -- GLOB is a simple pattern match: every date must look like 2026-11-07.
        date     TEXT    NOT NULL CHECK (date GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]'),
        steps    INTEGER NOT NULL CHECK (steps >= 0),
        calories INTEGER NOT NULL CHECK (calories >= 0),
        water    INTEGER NOT NULL CHECK (water >= 0)
      );
      CREATE INDEX idx_health_records_date ON health_records (date);
    `);
    await seedHealthRecords(db);
  },
];

export async function migrate(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = row?.user_version ?? 0;

  for (let version = currentVersion; version < MIGRATIONS.length; version++) {
    await db.withTransactionAsync(async () => {
      await MIGRATIONS[version](db);
      await db.execAsync(`PRAGMA user_version = ${version + 1}`);
    });
  }
}