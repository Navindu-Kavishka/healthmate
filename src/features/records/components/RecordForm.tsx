import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator, Button, HelperText, TextInput } from 'react-native-paper';

import { EmptyState } from '@/core/ui/EmptyState';
import { parseISODate, toISODate } from '@/core/utils/dates';
import { useRecordForm } from '../useRecordForm';

type Props = {
  recordId?: number;
};

// add/edit record form screen
export function RecordForm({ recordId }: Props) {
  const form = useRecordForm(recordId);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  async function handleSave() {
    const saved = await form.save();
    if (saved) router.back();
  }

  function handleDatePicked(event: DateTimePickerEvent, pickedDate?: Date) {
    setIsPickerOpen(false);
    if (event.type === 'set' && pickedDate) {
      form.setField('date', toISODate(pickedDate));
    }
  }

  if (form.isLoading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  if (form.notFound) {
    return <EmptyState icon="file-question-outline" title="Record not found" message="It may have been deleted." />;
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextInput
          mode="outlined"
          label="Date (YYYY-MM-DD)"
          value={form.values.date}
          onChangeText={(text) => form.setField('date', text)}
          error={Boolean(form.errors.date)}
          right={<TextInput.Icon icon="calendar" accessibilityLabel="Pick a date" onPress={() => setIsPickerOpen(true)} />}
        />
        <HelperText type="error" visible={Boolean(form.errors.date)}>
          {form.errors.date}
        </HelperText>

        <NumberField
          label="Steps"
          unit="steps"
          value={form.values.steps}
          error={form.errors.steps}
          onChangeText={(text) => form.setField('steps', text)}
        />
        <NumberField
          label="Calories"
          unit="kcal"
          value={form.values.calories}
          error={form.errors.calories}
          onChangeText={(text) => form.setField('calories', text)}
        />
        <NumberField
          label="Water"
          unit="ml"
          value={form.values.water}
          error={form.errors.water}
          onChangeText={(text) => form.setField('water', text)}
        />

        <Button mode="contained" icon="content-save" onPress={handleSave} loading={form.isSaving} disabled={form.isSaving}>
          {form.isEditing ? 'Save changes' : 'Add record'}
        </Button>
      </ScrollView>

      {isPickerOpen ? (
        <DateTimePicker
          value={parseISODate(form.values.date) ?? new Date()}
          mode="date"
          maximumDate={new Date()}
          onChange={handleDatePicked}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

type NumberFieldProps = {
  label: string;
  unit: string;
  value: string;
  error?: string;
  onChangeText: (text: string) => void;
};

// number input field with unit and error message
function NumberField({ label, unit, value, error, onChangeText }: NumberFieldProps) {
  return (
    <>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        error={Boolean(error)}
        right={<TextInput.Affix text={unit} />}
      />
      <HelperText type="error" visible={Boolean(error)}>
        {error}
      </HelperText>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16 },
  loading: { marginTop: 32 },
});