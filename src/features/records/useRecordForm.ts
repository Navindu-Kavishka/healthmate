import { useEffect, useState } from 'react';

import { useSnackbarStore } from '@/core/ui/snackbarStore';
import { todayISO } from '@/core/utils/dates';
import * as recordRepository from './recordRepository';
import { useRecordStore } from './recordStore';
import { validateRecord, type RecordFormErrors, type RecordFormValues } from './validation';
import { estimateCalories } from './calorieEstimate';

function emptyForm(): RecordFormValues {
  return { date: todayISO(), steps: '', calories: '', water: '' };
}

// ViewModel for the Add / Edit screen.
export function useRecordForm(recordId?: number) {
  const addRecord = useRecordStore((state) => state.addRecord);
  const updateRecord = useRecordStore((state) => state.updateRecord);
  const showMessage = useSnackbarStore((state) => state.showMessage);

  const isEditing = recordId !== undefined;
  const [values, setValues] = useState<RecordFormValues>(emptyForm);
  const [errors, setErrors] = useState<RecordFormErrors>({});
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  // a saved number is not an estimate, so editing starts with the field overruled.
  const [caloriesTouched, setCaloriesTouched] = useState(isEditing);

  // Edit mode: load the record once and put its numbers into the text fields.
  useEffect(() => {
    if (recordId === undefined) return;
    let isCancelled = false; // set if the screen closes before the query finishes

    async function loadRecord(id: number) {
      try {
        const record = await recordRepository.getRecordById(id);
        if (isCancelled) return;
        if (record) {
          setValues({
            date: record.date,
            steps: String(record.steps),
            calories: String(record.calories),
            water: String(record.water),
          });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error(error);
        if (!isCancelled) setNotFound(true);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadRecord(recordId);
    return () => {
      isCancelled = true;
    };
  }, [recordId]);

  function setField(field: keyof RecordFormValues, value: string) {
    if (field === 'calories') setCaloriesTouched(true);

    setValues((current) => {
      const next = { ...current, [field]: value };
      // While calories has not been edited, it follows the steps.
      if (field === 'steps' && !caloriesTouched) {
        const steps = Number(value.trim() || 0);
        next.calories = steps > 0 ? String(estimateCalories(steps)) : '';
      }
      return next;
    });
    // hide this field's error and the form level one while fixing them
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  }

  // Pretend calories was never edited: it follows the steps again.
  function recalculateCalories() {
    setCaloriesTouched(false);
    setValues((current) => ({
      ...current,
      calories: String(estimateCalories(Number(current.steps.trim() || 0))),
    }));
  }

  // Validates and saves. Returns true when saved
  async function save(): Promise<boolean> {
    const result = validateRecord(values);
    if (!result.ok) {
      setErrors(result.errors);
      return false;
    }

    setIsSaving(true);
    try {
      if (recordId === undefined) {
        await addRecord(result.record);
        showMessage('Record added');
      } else {
        await updateRecord({ id: recordId, ...result.record });
        showMessage('Record updated');
      }
      return true;
    } catch (error) {
      console.error(error);
      showMessage('Could not save. Please try again.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    values,
    errors,
    isEditing,
    isLoading,
    isSaving,
    notFound,
    caloriesTouched,
    setField,
    recalculateCalories,
    save,
  };
}