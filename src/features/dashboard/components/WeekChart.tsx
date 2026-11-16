import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import { formatWeekday } from '@/core/utils/dates';
import { formatNumber } from '@/core/utils/format';
import type { DayTotals } from '@/features/records/types';

const CHART_HEIGHT = 140;

type Props = {
  days: DayTotals[];
  goal: number;
};

//Bar chart of steps per day, drawn with plain Views (no chart library).
// Each bar's height is its share of the tallest value. Days that met the goal are solid.
export function WeekChart({ days, goal }: Props) {
  const theme = useTheme();
  const tallest = Math.max(goal, ...days.map((day) => day.steps));
  const daysMet = days.filter((day) => day.steps >= goal).length;

  return (
    <Card mode="outlined">
      <Card.Title title="Steps, last 7 days" subtitle={`Goal met on ${daysMet} of ${days.length} days`} />
      <Card.Content>
        <View style={styles.chart} accessibilityLabel={`Steps chart. Goal met on ${daysMet} of ${days.length} days.`}>
          {/* Dashed line at the goal height */}
          <View
            style={[styles.goalLine, { bottom: (goal / tallest) * CHART_HEIGHT, borderColor: theme.colors.outline }]}
          />
          {days.map((day) => (
            <View key={day.date} style={styles.column}>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max((day.steps / tallest) * CHART_HEIGHT, 2),
                    backgroundColor: day.steps >= goal ? theme.colors.primary : theme.colors.primaryContainer,
                  },
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.labels}>
          {days.map((day) => (
            <View key={day.date} style={styles.column}>
              <Text variant="labelSmall">{formatWeekday(day.date)}</Text>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {day.steps >= 1000 ? `${Math.round(day.steps / 1000)}k` : formatNumber(day.steps)}
              </Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  chart: { height: CHART_HEIGHT, flexDirection: 'row', alignItems: 'flex-end' },
  goalLine: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderStyle: 'dashed' },
  column: { flex: 1, alignItems: 'center' },
  bar: { width: '60%', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  labels: { flexDirection: 'row', marginTop: 6 },
});