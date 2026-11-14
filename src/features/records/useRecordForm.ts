import { useState } from 'react';

import { useSnackbarStore } from '@/core/ui/snackbarStore';
import { todayISO } from '@/core/utils/dates';
import { useRecordStore } from './recordStore';
import { validateRecord, type RecordFormErrors, type RecordFormValues } from './validation';

function emptyForm(): RecordFormValues {
  return { date: todayISO(), steps: '', calories: '', water: '' };
}

// view model for the record form screen
export function useRecordForm(recordId?: number) {
  const addRecord = useRecordStore((state) => state.addRecord);
  const showMessage = useSnackbarStore((state) => state.showMessage);

  const isEditing = recordId !== undefined;
  const [values, setValues] = useState<RecordFormValues>(emptyForm);
  const [errors, setErrors] = useState<RecordFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  function setField(field: keyof RecordFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined })); // hide the error while fixing it
  }

  // validate and save the record, returning true if successful
  async function save(): Promise<boolean> {
    const result = validateRecord(values);
    if (!result.ok) {
      setErrors(result.errors);
      return false;
    }

    setIsSaving(true);
    try {
      await addRecord(result.record);
      showMessage('Record added');
      return true;
    } catch (error) {
      console.error(error);
      showMessage('Could not save. Please try again.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  return { values, errors, isEditing, isLoading: false, isSaving, notFound: false, setField, save };
}