import { wholeNumberError } from '@/core/utils/validation';
import { RECORD_LIMITS } from '@/features/records/validation';
import type { Goals } from './types';

export type GoalFormValues = Record<keyof Goals, string>;
export type GoalFormErrors = Partial<GoalFormValues>;

export type GoalValidationResult = { ok: true; goals: Goals } | { ok: false; errors: GoalFormErrors };

// A goal must be at least 1 (a goal of 0 is always "met")
export function validateGoals(values: GoalFormValues): GoalValidationResult {
  const errors: GoalFormErrors = {
    steps: wholeNumberError(values.steps, 'Step goal', RECORD_LIMITS.steps, 1),
    calories: wholeNumberError(values.calories, 'Calorie goal', RECORD_LIMITS.calories, 1),
    water: wholeNumberError(values.water, 'Water goal', RECORD_LIMITS.water, 1),
  };

  if (Object.values(errors).some(Boolean)) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    goals: {
      steps: Number(values.steps.trim()),
      calories: Number(values.calories.trim()),
      water: Number(values.water.trim()),
    },
  };
}

export function toGoalFormValues(goals: Goals): GoalFormValues {
  return { steps: String(goals.steps), calories: String(goals.calories), water: String(goals.water) };
}