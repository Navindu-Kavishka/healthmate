import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Modal, Portal, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';

import { METRICS } from '../metrics';
import { ENTRY_METRICS, type EntryMetric } from '../types';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (metric: EntryMetric, amount: number, note: string | null) => void;
};

const KIND_BUTTONS = ENTRY_METRICS.map((metric) => ({ value: metric, label: METRICS[metric].label }));

// One entry at a time: steps, calories or water. The parent decides where it goes.
export function AddEntrySheet({ visible, onDismiss, onSubmit }: Props) {
  const theme = useTheme();
  const [metric, setMetric] = useState<EntryMetric>('steps');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  function reset() {
    setAmount('');
    setNote('');
    setError(undefined);
  }

  function handleAdd() {
    const trimmed = amount.trim();

    // should be a positive whole number anything else does nothingg
    if (!/^\d+$/.test(trimmed) || Number(trimmed) <= 0) {
      setError('Enter a whole number above 0');
      return;
    }

    onSubmit(metric, Number(trimmed), note.trim() || null);
    reset();
    onDismiss();
  }

  function handleDismiss() {
    reset();
    onDismiss();
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleDismiss} contentContainerStyle={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
        <Text variant="titleMedium">Add an entry</Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Steps, calories or water — one number at a time.
        </Text>

        <SegmentedButtons
          value={metric}
          onValueChange={(value) => setMetric(value as EntryMetric)}
          buttons={KIND_BUTTONS}
        />

        <TextInput
          mode="outlined"
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="number-pad"
          error={Boolean(error)}
          right={<TextInput.Affix text={METRICS[metric].unit} />}
        />
        <HelperText type="error" visible={Boolean(error)}>
          {error}
        </HelperText>

        <TextInput mode="outlined" label="Note (optional)" value={note} onChangeText={setNote} />

        <View style={styles.actions}>
          <Button onPress={handleDismiss}>Cancel</Button>
          <Button mode="contained" icon="plus" onPress={handleAdd}>
            Add entry
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  sheet: { margin: 16, padding: 20, borderRadius: 28, gap: 10 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
});