import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';

import type { Goals } from '../types';
import { useGoalsForm } from '../useGoalsForm';
import type { GoalFormValues } from '../validation';

const FIELDS: { field: keyof GoalFormValues; label: string; unit: string }[] = [
  { field: 'steps', label: 'Daily steps', unit: 'steps' },
  { field: 'calories', label: 'Daily calories', unit: 'kcal' },
  { field: 'water', label: 'Daily water', unit: 'ml' },
];

export function GoalsForm({ initialGoals }: { initialGoals: Goals }) {
  const form = useGoalsForm(initialGoals);

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text variant="bodyMedium" style={styles.intro}>
        Set a target for each day. The Today tab shows how close you are.
      </Text>

      {FIELDS.map(({ field, label, unit }) => (
        <View key={field}>
          <TextInput
            mode="outlined"
            label={label}
            value={form.values[field]}
            onChangeText={(text) => form.setField(field, text)}
            keyboardType="number-pad"
            error={Boolean(form.errors[field])}
            right={<TextInput.Affix text={unit} />}
          />
          <HelperText type="error" visible={Boolean(form.errors[field])}>
            {form.errors[field]}
          </HelperText>
        </View>
      ))}

      <Button mode="contained" icon="content-save" onPress={form.save} loading={form.isSaving} disabled={form.isSaving}>
        Save goals
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  intro: { marginBottom: 12 },
});