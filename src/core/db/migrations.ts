import type { SQLiteDatabase } from 'expo-sqlite';

import { DEFAULT_GOALS } from '@/features/goals/types';
import { seedHealthRecords } from './seed';

type Migration = (db: SQLiteDatabase) => Promise<void>;

// migrations with versions
const MIGRATIONS: Migration[] = [
  // Version 1: the records table, plus dummy data on first launch.
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

  // Version 2: daily goals. A single row whose id is always 1.
  async (db) => {
    await db.execAsync(`
      CREATE TABLE goals (
        id       INTEGER PRIMARY KEY CHECK (id = 1),
        steps    INTEGER NOT NULL,
        calories INTEGER NOT NULL,
        water    INTEGER NOT NULL
      );
    `);
    await db.runAsync(
      'INSERT INTO goals (id, steps, calories, water) VALUES (1, ?, ?, ?)',
      DEFAULT_GOALS.steps,
      DEFAULT_GOALS.calories,
      DEFAULT_GOALS.water,
    );
  },

  // Version 3: the log behind the totals. health_records stays the day's rollup,
  // record_entries says what happened to make it
  async (db) => {
    await db.execAsync(`
      CREATE TABLE record_entries (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        -- Deleting the day deletes its log (needs PRAGMA foreign_keys = ON).
        record_id  INTEGER NOT NULL REFERENCES health_records(id) ON DELETE CASCADE,
        created_at TEXT    NOT NULL,
        metric     TEXT    NOT NULL CHECK (metric IN ('steps', 'calories', 'water')),
        amount     INTEGER NOT NULL CHECK (amount > 0),
        note       TEXT
      );
      CREATE INDEX idx_record_entries_record ON record_entries (record_id, created_at);
    `);

    // Every day that already has a number starts with one entry per non-zero metric.
    // NOT EXISTS keeps this safe to run twice.
    await db.execAsync(`
      INSERT INTO record_entries (record_id, created_at, metric, amount, note)
      SELECT id, date || 'T00:00:00', 'steps', steps, 'opening balance'
      FROM health_records
      WHERE steps > 0
        AND NOT EXISTS (
          SELECT 1 FROM record_entries
          WHERE record_entries.record_id = health_records.id AND record_entries.metric = 'steps'
        );
      INSERT INTO record_entries (record_id, created_at, metric, amount, note)
      SELECT id, date || 'T00:00:00', 'calories', calories, 'opening balance'
      FROM health_records
      WHERE calories > 0
        AND NOT EXISTS (
          SELECT 1 FROM record_entries
          WHERE record_entries.record_id = health_records.id AND record_entries.metric = 'calories'
        );
      INSERT INTO record_entries (record_id, created_at, metric, amount, note)
      SELECT id, date || 'T00:00:00', 'water', water, 'opening balance'
      FROM health_records
      WHERE water > 0
        AND NOT EXISTS (
          SELECT 1 FROM record_entries
          WHERE record_entries.record_id = health_records.id AND record_entries.metric = 'water'
        );
    `);
  },
];

// Runs every migration the database hasn't had yet, each one in its own transaction. 
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