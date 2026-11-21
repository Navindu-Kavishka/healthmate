import { useState } from 'react';

import { useSnackbarStore } from '@/core/ui/snackbarStore';
import { useGoalStore } from './goalStore';
import type { Goals } from './types';
import { toGoalFormValues, validateGoals, type GoalFormErrors, type GoalFormValues } from './validation';

// ViewModel for the Goals form. Starts from the saved goals
export function useGoalsForm(initialGoals: Goals) {
  const saveGoals = useGoalStore((state) => state.saveGoals);
  const showMessage = useSnackbarStore((state) => state.showMessage);

  const [values, setValues] = useState<GoalFormValues>(() => toGoalFormValues(initialGoals));
  const [errors, setErrors] = useState<GoalFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  function setField(field: keyof GoalFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    const result = validateGoals(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setIsSaving(true);
    try {
      await saveGoals(result.goals);
      showMessage('Goals saved');
    } catch (error) {
      console.error(error);
      showMessage('Could not save your goals');
    } finally {
      setIsSaving(false);
    }
  }

  return { values, errors, isSaving, setField, save };
}