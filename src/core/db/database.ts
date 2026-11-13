import * as SQLite from 'expo-sqlite';

import { migrate } from './migrations';

const DATABASE_NAME = 'healthmate.db';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

// singleton db connection
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = openDatabase().catch((error) => {
      databasePromise = null; 
      throw error;
    });
  }
  return databasePromise;
}

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL;'); 
  await migrate(db);
  return db;
}