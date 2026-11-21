import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, FAB, HelperText, Text, useTheme } from 'react-native-paper';

import { useMetricColors, useMetricFills } from '@/core/theme/theme';
import { formatDisplayDate, todayISO } from '@/core/utils/dates';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { WeekChart } from '@/features/dashboard/components/WeekChart';
import { useDashboard } from '@/features/dashboard/useDashboard';
import { AddEntrySheet } from '@/features/records/components/AddEntrySheet';
import { EntryList } from '@/features/records/components/EntryList';

// one tap per glass
const WATER_AMOUNTS = [250, 500, 1000];

export default function TodayScreen() {
  const theme = useTheme();
  const colors = useMetricColors();
  const fills = useMetricFills();
  const { today, entries, week, goals, isLoading, error, logEntry, quickAddWater } = useDashboard();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const date = todayISO();

  if (isLoading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleLarge" style={styles.date}>
          {formatDisplayDate(date)}
        </Text>
        {error ? <HelperText type="error">{error}</HelperText> : null}

        <StatCard icon="walk" label="Steps" unit="steps" value={today.steps} goal={goals.steps} color={colors.steps} fill={fills.steps} />
        <StatCard icon="fire" label="Calories" unit="kcal" value={today.calories} goal={goals.calories} color={colors.calories} fill={fills.calories} />
        <StatCard icon="cup-water" label="Water" unit="ml" value={today.water} goal={goals.water} color={colors.water} fill={fills.water}>
          <View style={styles.chips}>
            {WATER_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                mode="outlined"
                compact
                style={styles.chip}
                accessibilityLabel={`Add ${amount} millilitres of water`}
                onPress={() => quickAddWater(amount)}
              >
                {amount >= 1000 ? `+${amount / 1000} L` : `+${amount} ml`}
              </Button>
            ))}
          </View>
        </StatCard>

        <Card mode="contained" style={styles.log}>
          <Card.Content style={styles.logContent}>
            <View style={styles.logHeader}>
              <Text variant="titleMedium" style={styles.logTitle}>
                {"Today's log"}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {entries.length === 1 ? '1 entry' : `${entries.length} entries`}
              </Text>
            </View>
            <EntryList entries={entries} />
            <View style={styles.logActions}>
              <Button compact icon="plus" onPress={() => setIsSheetOpen(true)}>
                Add entry
              </Button>
              <Button compact onPress={() => router.push(`/day/${date}`)}>
                See all
              </Button>
            </View>
          </Card.Content>
        </Card>

        <WeekChart days={week} goal={goals.steps} />
      </ScrollView>

      <FAB icon="plus" label="Add" style={styles.fab} onPress={() => router.push('/record/new')} />
      <AddEntrySheet visible={isSheetOpen} onDismiss={() => setIsSheetOpen(false)} onSubmit={logEntry} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 96 },
  date: { marginBottom: 12 },
  loading: { marginTop: 32 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 16 },
  log: { marginBottom: 12 },
  logContent: { gap: 10 },
  logHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logTitle: { flex: 1 },
  logActions: { flexDirection: 'row', justifyContent: 'space-between' },
  fab: { position: 'absolute', right: 16, bottom: 16 },
});