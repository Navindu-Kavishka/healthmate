import { parseISODate, todayISO } from '@/core/utils/dates';
import { wholeNumberError } from '@/core/utils/validation';
import type { NewHealthRecord } from './types';

// record form values
export type RecordFormValues = {
  date: string;
  steps: string;
  calories: string;
  water: string;
};

// errors for each field
export type RecordFormErrors = Partial<Record<keyof RecordFormValues, string>>;

export type RecordValidationResult =
  | { ok: true; record: NewHealthRecord }
  | { ok: false; errors: RecordFormErrors };

// limits for each fields 
export const RECORD_LIMITS = { steps: 100_000, calories: 10_000, water: 10_000 } as const;

function dateError(text: string, today: string): string | undefined {
  const date = text.trim();
  if (date === '') return 'Date is required';
  if (!parseISODate(date)) return 'Use the format YYYY-MM-DD';
  if (date > today) return 'Date cannot be in the future'; // ISO text compares like dates
  return undefined;
}

// validate rocord form values and returen errors
export function validateRecord(values: RecordFormValues, today = todayISO()): RecordValidationResult {
  const errors: RecordFormErrors = {
    date: dateError(values.date, today),
    steps: wholeNumberError(values.steps, 'Steps', RECORD_LIMITS.steps),
    calories: wholeNumberError(values.calories, 'Calories', RECORD_LIMITS.calories),
    water: wholeNumberError(values.water, 'Water', RECORD_LIMITS.water),
  };

  if (Object.values(errors).some(Boolean)) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    record: {
      date: values.date.trim(),
      steps: Number(values.steps.trim()),
      calories: Number(values.calories.trim()),
      water: Number(values.water.trim()),
    },
  };
}