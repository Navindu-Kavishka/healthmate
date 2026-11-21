import type { SortOption } from './types';

// what the history list is filtered by: a date prefix and/or a from/to range
export type RecordFilter = {
  text?: string;
  from?: string | null;
  to?: string | null;
  sort?: SortOption;
};

export type RecordWhere = {
  where: string;
  params: string[];
};

// builds the WHERE part and its ? values. user text only goes in the values, never in the SQL.
// from/to are inclusive, so 1 Nov to 30 Nov keeps both days
export function buildRecordFilter({ text = '', from, to }: RecordFilter = {}): RecordWhere {
  const prefix = text.replace(/[^0-9-]/g, ''); // dates only hold digits and dashes
  const where = ['date LIKE ?'];
  const params = [`${prefix}%`];

  if (from) {
    where.push('date >= ?');
    params.push(from);
  }
  if (to) {
    where.push('date <= ?');
    params.push(to);
  }

  return { where: where.join(' AND '), params };
}