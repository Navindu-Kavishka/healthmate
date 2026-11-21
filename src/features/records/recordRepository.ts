import type { SQLiteDatabase } from 'expo-sqlite';

import { getDb } from '@/core/db/database';
import { buildRecordFilter, type RecordFilter } from './recordFilter';
import { EMPTY_TOTALS, ENTRY_METRICS, type DayTotals, type EntryMetric, type HealthRecord, type NewHealthRecord, type RecordEntry, type SortOption, type Totals } from './types';


const COLUMNS = 'id, date, steps, calories, water';
const ENTRY_COLUMNS = 'id, record_id AS recordId, created_at AS createdAt, metric, amount, note';

// ORDER BY can't take a ? placeholder, only these fixed strings are ever used
const ORDER_BY: Record<SortOption, string> = {
  newest: 'date DESC, id DESC',
  oldest: 'date ASC, id ASC',
  mostSteps: 'steps DESC, date DESC',
};

// same for column names: an entry's metric picks one of these three strings,
// so no user value ever reaches the SQL text.
const TOTALS_COLUMN: Record<EntryMetric, 'steps' | 'calories' | 'water'> = {
  steps: 'steps',
  calories: 'calories',
  water: 'water',
};

const INSERT_EMPTY_DAY = 'INSERT INTO health_records (date, steps, calories, water) VALUES (?, 0, 0, 0)';

// records where the date starts with the search text, and inside from/to if they are set
export async function getRecords({
  text = '',
  from,
  to,
  sort = 'newest',
}: RecordFilter = {}): Promise<HealthRecord[]> {
  const db = await getDb();
  const { where, params } = buildRecordFilter({ text, from, to });
  return db.getAllAsync<HealthRecord>(
    `SELECT ${COLUMNS} FROM health_records WHERE ${where} ORDER BY ${ORDER_BY[sort]}`,
    ...params,
  );
}

export async function getRecordById(id: number): Promise<HealthRecord | null> {
  const db = await getDb();
  return db.getFirstAsync<HealthRecord>(`SELECT ${COLUMNS} FROM health_records WHERE id = ?`, id);
}

// Save a day record and returns the id , if record exist is updated
export async function addRecord(record: NewHealthRecord): Promise<number> {
  const db = await getDb();
  let recordId = 0;
  await db.withTransactionAsync(async () => {
    const existing = await db.getFirstAsync<{ id: number }>(
      'SELECT id FROM health_records WHERE date = ? ORDER BY id DESC LIMIT 1',
      record.date,
    );

    if (existing) {
      recordId = existing.id;
      await db.runAsync(
        'UPDATE health_records SET steps = steps + ?, calories = calories + ?, water = water + ? WHERE id = ?',
        record.steps,
        record.calories,
        record.water,
        recordId,
      );
    } else {
      const result = await db.runAsync(
        'INSERT INTO health_records (date, steps, calories, water) VALUES (?, ?, ?, ?)',
        record.date,
        record.steps,
        record.calories,
        record.water,
      );
      recordId = result.lastInsertRowId;
    }

    await appendEntries(db, recordId, record);
  });
  return recordId;
}

// Update an existing record and day's log is rebuilt from them.
export async function updateRecord(record: HealthRecord): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    // Moving a record onto a date that already has one would put two cards on that day.
    // The record being edited is the one the user just confirmed, so the other row goes.
    await db.runAsync(
      'DELETE FROM health_records WHERE date = ? AND id != ?',
      record.date,
      record.id,
    );
    await db.runAsync(
      'UPDATE health_records SET date = ?, steps = ?, calories = ?, water = ? WHERE id = ?',
      record.date,
      record.steps,
      record.calories,
      record.water,
      record.id,
    );
    await replaceEntries(db, record.id, record);
  });
}

// Delete a record by id. Its entries go with it through ON DELETE CASCADE.
export async function deleteRecord(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM health_records WHERE id = ?', id);
}

// One entry per number that was added: the log says what happened, not just the new total.
async function appendEntries(db: SQLiteDatabase, recordId: number, added: Totals): Promise<void> {
  const createdAt = new Date().toISOString();
  for (const metric of ENTRY_METRICS) {
    const amount = added[metric];
    if (amount > 0) {
      await db.runAsync(
        'INSERT INTO record_entries (record_id, created_at, metric, amount, note) VALUES (?, ?, ?, ?, ?)',
        recordId,
        createdAt,
        metric,
        amount,
        null,
      );
    }
  }
}

// copy of the day and its log, taken before the delete so Undo can put it back
export type RecordSnapshot = { record: HealthRecord; entries: RecordEntry[] };

export async function snapshotRecord(id: number): Promise<RecordSnapshot | null> {
  const db = await getDb();
  const record = await getRecordById(id);
  if (!record) return null;
  const entries = await db.getAllAsync<RecordEntry>(
    `SELECT ${ENTRY_COLUMNS} FROM record_entries WHERE record_id = ? ORDER BY created_at, id`,
    id,
  );
  return { record, entries };
}

// puts the day and its log back with the same ids, so links to the day still work.
// if the day is already back it does nothing, so a double tap on Undo is safe
export async function restoreRecord({ record, entries }: RecordSnapshot): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    const existing = await db.getFirstAsync<{ id: number }>(
      'SELECT id FROM health_records WHERE id = ?',
      record.id,
    );
    if (existing) return;

    await db.runAsync(
      'INSERT INTO health_records (id, date, steps, calories, water) VALUES (?, ?, ?, ?, ?)',
      record.id,
      record.date,
      record.steps,
      record.calories,
      record.water,
    );
    for (const entry of entries) {
      await db.runAsync(
        'INSERT INTO record_entries (id, record_id, created_at, metric, amount, note) VALUES (?, ?, ?, ?, ?, ?)',
        entry.id,
        entry.recordId,
        entry.createdAt,
        entry.metric,
        entry.amount,
        entry.note,
      );
    }
  });
}

// The total is the day's truth, so saving it rewrites the log that explains it.
async function replaceEntries(db: SQLiteDatabase, recordId: number, totals: Totals): Promise<void> {
  const createdAt = new Date().toISOString();
  await db.runAsync('DELETE FROM record_entries WHERE record_id = ?', recordId);

  for (const metric of ENTRY_METRICS) {
    if (totals[metric] > 0) {
      await db.runAsync(
        'INSERT INTO record_entries (record_id, created_at, metric, amount, note) VALUES (?, ?, ?, ?, ?)',
        recordId,
        createdAt,
        metric,
        totals[metric],
        'edited totals',
      );
    }
  }
}

// get all on one date, oldest first
export async function getEntriesForDate(date: string): Promise<RecordEntry[]> {
  const db = await getDb();
  return db.getAllAsync<RecordEntry>(
    `SELECT ${ENTRY_COLUMNS} FROM record_entries
     WHERE record_id IN (SELECT id FROM health_records WHERE date = ?)
     ORDER BY created_at, id`,
    date,
  );
}

// Writes one entry and adds its amount to the day's total, or creates the day at 0 first
export async function addEntry(
  date: string,
  metric: EntryMetric,
  amount: number,
  note: string | null = null,
): Promise<RecordEntry> {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error(`Invalid entry amount: ${amount}`);
  }

  const db = await getDb();
  const createdAt = new Date().toISOString();
  let recordId = 0;
  let entryId = 0;

  await db.withTransactionAsync(async () => {
    // A day with no row yet start empty, so the entry has something to belong to.
    const day = await db.getFirstAsync<{ id: number }>(
      'SELECT id FROM health_records WHERE date = ? ORDER BY id DESC LIMIT 1',
      date,
    );
    recordId = day?.id ?? (await db.runAsync(INSERT_EMPTY_DAY, date)).lastInsertRowId;

    const result = await db.runAsync(
      'INSERT INTO record_entries (record_id, created_at, metric, amount, note) VALUES (?, ?, ?, ?, ?)',
      recordId,
      createdAt,
      metric,
      amount,
      note,
    );
    entryId = result.lastInsertRowId;
    await db.runAsync(
      `UPDATE health_records SET ${TOTALS_COLUMN[metric]} = ${TOTALS_COLUMN[metric]} + ? WHERE id = ?`,
      amount,
      recordId,
    );
  });

  return { id: entryId, recordId, createdAt, metric, amount, note };
}

// Removes one entry and takes its amount back off the day, never below zero
export async function deleteEntry(id: number): Promise<void> {
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    const entry = await db.getFirstAsync<Pick<RecordEntry, 'recordId' | 'metric' | 'amount'>>(
      'SELECT record_id AS recordId, metric, amount FROM record_entries WHERE id = ?',
      id,
    );
    if (!entry) return; // already gone- a second undo, or the day was deleted

    await db.runAsync('DELETE FROM record_entries WHERE id = ?', id);
    await db.runAsync(
      `UPDATE health_records
       SET ${TOTALS_COLUMN[entry.metric]} = MAX(${TOTALS_COLUMN[entry.metric]} - ?, 0)
       WHERE id = ?`,
      entry.amount,
      entry.recordId,
    );
  });
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

// One row per date between the two dates (inclusive). Dates with no entries are missing
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