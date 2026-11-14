import { StyleSheet, View } from 'react-native';
import { Card, Icon, IconButton, Text, useTheme } from 'react-native-paper';

import { formatDisplayDate } from '@/core/utils/dates';
import { formatNumber } from '@/core/utils/format';
import type { HealthRecord } from '../types';

type Props = {
  record: HealthRecord;
  onPress: () => void;
  onDelete: () => void;
};

// records in the History list edit
export function RecordCard({ record, onPress, onDelete }: Props) {
  return (
    <Card mode="elevated" style={styles.card} onPress={onPress} accessibilityHint="Opens the record for editing">
      <Card.Title
        title={formatDisplayDate(record.date)}
        titleVariant="titleMedium"
        right={(props) => (
          <IconButton {...props} icon="delete-outline" accessibilityLabel="Delete record" onPress={onDelete} />
        )}
      />
      <Card.Content style={styles.metrics}>
        <Metric icon="walk" value={record.steps} unit="steps" />
        <Metric icon="fire" value={record.calories} unit="kcal" />
        <Metric icon="cup-water" value={record.water} unit="ml" />
      </Card.Content>
    </Card>
  );
}

function Metric({ icon, value, unit }: { icon: string; value: number; unit: string }) {
  const theme = useTheme();

  return (
    <View style={styles.metric}>
      <Icon source={icon} size={20} color={theme.colors.primary} />
      <Text variant="titleSmall">{formatNumber(value)}</Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginVertical: 6 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between' },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});