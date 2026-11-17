import { StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

import { formatEntryTime } from '@/core/utils/dates';
import { formatNumber } from '@/core/utils/format';
import type { EntryMetric, RecordEntry } from '../types';

// icon and unit for one kind of entry
const METRIC: Record<EntryMetric, { icon: string; unit: string }> = {
  steps: { icon: 'walk', unit: 'steps' },
  calories: { icon: 'fire', unit: 'kcal' },
  water: { icon: 'cup-water', unit: 'ml' },
};

type Props = {
  entries: RecordEntry[];
};

// The log behind a day's totals, oldest first
export function EntryList({ entries }: Props) {
  const theme = useTheme();

  if (entries.length === 0) {
    return (
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        Nothing logged yet.
      </Text>
    );
  }

  return (
    <View style={styles.list}>
      {entries.map((entry) => (
        <View key={entry.id} style={styles.row}>
          <Text variant="bodySmall" style={styles.time}>
            {formatEntryTime(entry.createdAt)}
          </Text>
          <Icon source={METRIC[entry.metric].icon} size={18} color={theme.colors.onSurfaceVariant} />
          <Text variant="titleSmall">{formatNumber(entry.amount)}</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {METRIC[entry.metric].unit}
          </Text>
          {entry.note ? (
            <Text variant="bodySmall" numberOfLines={1} style={[styles.note, { color: theme.colors.onSurfaceVariant }]}>
              {entry.note}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  time: { width: 40 },
  // the note takes the space that is left and is cut with an ellipsis
  note: { flex: 1, textAlign: 'right' },
});