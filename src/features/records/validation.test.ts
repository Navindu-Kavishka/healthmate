import type { RecordFormValues, RecordValidationResult } from './validation';
import { validateRecord } from './validation';

const TODAY = '2026-11-07';
const TOMORROW = '2026-11-08';

// a form with every number left empty
function values(overrides: Partial<RecordFormValues> = {}): RecordFormValues {
  return { date: TODAY, steps: '', calories: '', water: '', ...overrides };
}

function recordOf(result: RecordValidationResult) {
  if (result.ok) return result.record;
  throw new Error(`expected a valid record, got ${JSON.stringify(result.errors)}`);
}

function errorsOf(result: RecordValidationResult) {
  if (!result.ok) return result.errors;
  throw new Error('expected the form to be rejected');
}

describe('validateRecord', () => {
  it('accepts a day with steps and nothing else', () => {
    expect(recordOf(validateRecord(values({ steps: '500' }), TODAY))).toEqual({
      date: TODAY,
      steps: 500,
      calories: 0,
      water: 0,
    });
  });

  it('accepts a day with water and nothing else', () => {
    expect(recordOf(validateRecord(values({ water: '250' }), TODAY))).toEqual({
      date: TODAY,
      steps: 0,
      calories: 0,
      water: 250,
    });
  });

  it('asks for one number when all three are empty', () => {
    const errors = errorsOf(validateRecord(values(), TODAY));
    expect(errors.form).toBe('Add at least one number');
    expect(errors.steps).toBeUndefined();
    expect(errors.calories).toBeUndefined();
    expect(errors.water).toBeUndefined();
  });

  it('rejects a decimal step count', () => {
    const errors = errorsOf(validateRecord(values({ steps: '4.5' }), TODAY));
    expect(errors.steps).toBe('Steps must be a whole number');
  });

  it('rejects water above the limit', () => {
    const errors = errorsOf(validateRecord(values({ water: '12000' }), TODAY));
    expect(errors.water).toBe('Water must be 10,000 or less');
  });

  it('rejects a date that is not a real day', () => {
    const errors = errorsOf(validateRecord(values({ date: '2026-02-30', steps: '10' }), TODAY));
    expect(errors.date).toBe('Use the format YYYY-MM-DD');
  });

  it('rejects a date in the future', () => {
    const errors = errorsOf(validateRecord(values({ date: TOMORROW, steps: '10' }), TODAY));
    expect(errors.date).toBe('Date cannot be in the future');
  });

  it('requires a date', () => {
    const errors = errorsOf(validateRecord(values({ date: '', steps: '10' }), TODAY));
    expect(errors.date).toBe('Date is required');
  });

  it('accepts the step limit and rejects one more', () => {
    expect(recordOf(validateRecord(values({ steps: '100000' }), TODAY)).steps).toBe(100_000);
    expect(errorsOf(validateRecord(values({ steps: '100001' }), TODAY)).steps).toBe('Steps must be 100,000 or less');
  });
});