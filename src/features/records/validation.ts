import { parseISODate, todayISO } from '@/core/utils/dates';
import { formatNumber } from '@/core/utils/format';
import type { NewHealthRecord } from './types';

// record form values
export type RecordFormValues = {
  date: string;
  steps: string;
  calories: string;
  water: string;
};

// errors for each field
export type RecordFormErrors = Partial<Record<keyof RecordFormValues | 'form', string>>;

export type RecordValidationResult =
  | { ok: true; record: NewHealthRecord }
  | { ok: false; errors: RecordFormErrors };

// limits for fields
export const RECORD_LIMITS = { steps: 100_000, calories: 10_000, water: 10_000 } as const;

// cant be future date
function dateError(text: string, today: string): string | undefined {
  const date = text.trim();
  if (date === '') return 'Date is required';
  if (!parseISODate(date)) return 'Use the format YYYY-MM-DD';
  if (date > today) return 'Date cannot be in the future'; // ISO text compares like dates
  return undefined;
}

// Empty means zero for these numbers. A user can enter only steps or only water, for example.
function optionalNumberError(text: string, label: string, max: number): string | undefined {
  const trimmed = text.trim();
  if (trimmed === '') return undefined;
  if (!/^\d+$/.test(trimmed)) return `${label} must be a whole number`;
  if (Number(trimmed) > max) return `${label} must be ${formatNumber(max)} or less`;
  return undefined;
}

// validate record form values and return errorss
export function validateRecord(values: RecordFormValues, today = todayISO()): RecordValidationResult {
  const errors: RecordFormErrors = {
    date: dateError(values.date, today),
    steps: optionalNumberError(values.steps, 'Steps', RECORD_LIMITS.steps),
    calories: optionalNumberError(values.calories, 'Calories', RECORD_LIMITS.calories),
    water: optionalNumberError(values.water, 'Water', RECORD_LIMITS.water),
  };

  // empty fields are 0, so we do not end up with NaN values.
  const numbers = {
    steps: Number(values.steps.trim() || 0),
    calories: Number(values.calories.trim() || 0),
    water: Number(values.water.trim() || 0),
  };

  // If every field is valid, make sure the user entered at least one value
  if (!Object.values(errors).some(Boolean) && numbers.steps + numbers.calories + numbers.water === 0) {
    errors.form = 'Add at least one number';
  }

  if (Object.values(errors).some(Boolean)) {
    return { ok: false, errors };
  }

  return { ok: true, record: { date: values.date.trim(), ...numbers } };
}