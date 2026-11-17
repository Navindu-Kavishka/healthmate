import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, HelperText, Text, useTheme } from 'react-native-paper';

import { formatDisplayDate } from '@/core/utils/dates';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { useGoalStore } from '@/features/goals/goalStore';
import { EntryList } from '@/features/records/components/EntryList';
import { getEntriesForDate, getTotalsForDate } from '@/features/records/recordRepository';
import { EMPTY_TOTALS, type RecordEntry, type Totals } from '@/features/records/types';
import { useMetricColors } from '@/core/theme/theme';

// 1 day view: totals and log for a specific dat
export default function DayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const theme = useTheme();
  const colors = useMetricColors();
  const goals = useGoalStore((state) => state.goals);
  const loadGoals = useGoalStore((state) => state.loadGoals);

  const [totals, setTotals] = useState<Totals>(EMPTY_TOTALS);
  const [entries, setEntries] = useState<RecordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isCancelled = false; // set if the screen closes before the queries finish
      setIsLoading(true);

      async function loadDay() {
        try {
          const [dayTotals, dayEntries] = await Promise.all([
            getTotalsForDate(date),
            getEntriesForDate(date),
            loadGoals(),
          ]);
          if (isCancelled) return;
          setTotals(dayTotals);
          setEntries(dayEntries);
          setError(null);
        } catch (loadError) {
          console.error(loadError);
          if (!isCancelled) setError('Could not load this day.');
        } finally {
          if (!isCancelled) setIsLoading(false);
        }
      }

      loadDay();
      return () => {
        isCancelled = true;
      };
    }, [date, loadGoals]),
  );

  return (
    <>
      <Stack.Screen options={{ title: formatDisplayDate(date) }} />
      <ScrollView contentContainerStyle={styles.content}>
        {error ? <HelperText type="error">{error}</HelperText> : null}

        {isLoading ? (
          <ActivityIndicator style={styles.loading} />
        ) : (
          <>
            <StatCard icon="walk" label="Steps" unit="steps" value={totals.steps} goal={goals.steps} color={colors.steps} />
            <StatCard icon="fire" label="Calories" unit="kcal" value={totals.calories} goal={goals.calories} color={colors.calories} />
            <StatCard icon="cup-water" label="Water" unit="ml" value={totals.water} goal={goals.water} color={colors.water} />

            <Card mode="contained">
              <Card.Content style={styles.logContent}>
                <View style={styles.logHeader}>
                  <Text variant="titleMedium" style={styles.logTitle}>
                    Entry log
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {entries.length === 1 ? '1 entry' : `${entries.length} entries`}
                  </Text>
                </View>
                <EntryList entries={entries} />
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  loading: { marginTop: 32 },
  logContent: { gap: 10 },
  logHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logTitle: { flex: 1 },
});