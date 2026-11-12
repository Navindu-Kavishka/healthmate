import { ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { formatDisplayDate, todayISO } from '@/core/utils/dates';
import { StatCard } from '@/features/dashboard/components/StatCard';

// test data
const TODAY = { steps: 7850, calories: 420, water: 1800 };
const GOALS = { steps: 10_000, calories: 2_500, water: 2_500 };

export default function TodayScreen() {
  const theme = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text variant="titleLarge" style={styles.date}>
        {formatDisplayDate(todayISO())}
      </Text>

      <StatCard icon="walk" label="Steps" unit="steps" value={TODAY.steps} goal={GOALS.steps} color={theme.colors.primary} />
      <StatCard icon="fire" label="Calories" unit="kcal" value={TODAY.calories} goal={GOALS.calories} color={theme.colors.tertiary} />
      <StatCard icon="cup-water" label="Water" unit="ml" value={TODAY.water} goal={GOALS.water} color={theme.colors.secondary} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  date: { marginBottom: 12 },
});