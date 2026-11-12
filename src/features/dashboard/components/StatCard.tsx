import { StyleSheet, View } from 'react-native';
import { Card, Icon, ProgressBar, Text, useTheme } from 'react-native-paper';

import { formatNumber } from '@/core/utils/format';
import { progressTowards } from '../dashboardMath';

type Props = {
  icon: string;
  label: string;
  unit: string;
  value: number;
  goal: number;
  color: string;
};

// total for 1 measurement  
export function StatCard({ icon, label, unit, value, goal, color }: Props) {
  const theme = useTheme();
  const progress = progressTowards(value, goal);
  const percent = Math.round(progress * 100);

  return (
    <Card mode="contained" style={styles.card} accessibilityLabel={`${label}: ${formatNumber(value)} ${unit}, ${percent}% of goal`}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Icon source={icon} size={24} color={color} />
          <Text variant="titleMedium" style={styles.label}>
            {label}
          </Text>
          {value >= goal ? <Icon source="check-circle" size={20} color={theme.colors.primary} /> : null}
        </View>

        <Text variant="headlineMedium">
          {formatNumber(value)}
          <Text variant="bodyMedium"> {unit}</Text>
        </Text>

        <ProgressBar progress={progress} color={color} style={styles.bar} />
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {percent}% of {formatNumber(goal)} {unit}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  content: { gap: 6 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { flex: 1 },
  bar: { height: 8, borderRadius: 4 },
});