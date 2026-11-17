import { StyleSheet, View } from 'react-native';
import { Card, Icon, IconButton, Text, useTheme } from 'react-native-paper';

import { formatDisplayDate } from '@/core/utils/dates';
import { formatNumber } from '@/core/utils/format';
import type { EntryMetric, HealthRecord } from '../types';
import { METRICS } from '../metrics';
import { useMetricColors } from '@/core/theme/theme';

type Props = {
  record: HealthRecord;
  onPress: () => void;
  onDelete: () => void;
  onEdit?: () => void;
};

// records in the History list edit
export function RecordCard({ record, onPress, onEdit, onDelete }: Props) {
  return (
    <Card mode="elevated" style={styles.card} onPress={onPress} accessibilityHint="Opens the day's log">
      <Card.Title
        title={formatDisplayDate(record.date)}
        titleVariant="titleMedium"
        right={(props) => (
          <View style={styles.actions}>
            <IconButton {...props} icon="pencil-outline" accessibilityLabel="Edit record" onPress={onEdit} />
            <IconButton {...props} icon="delete-outline" accessibilityLabel="Delete record" onPress={onDelete} />
          </View>
        )}
      />
      <Card.Content style={styles.metrics}>
        <Metric metric="steps" value={record.steps} />
        <Metric metric="calories" value={record.calories} />
        <Metric metric="water" value={record.water} />
      </Card.Content>
    </Card>
  );
}

function Metric({ metric, value }: { metric: EntryMetric; value: number }) {
  const theme = useTheme();
  const colors = useMetricColors();

  return (
    <View style={styles.metric}>
      <Icon source={METRICS[metric].icon} size={20} color={colors[metric]} />
      <Text variant="titleSmall">{formatNumber(value)}</Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {METRICS[metric].unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginVertical: 6 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  metrics: { flexDirection: 'row', justifyContent: 'space-between' },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});