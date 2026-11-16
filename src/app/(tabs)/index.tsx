import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, HelperText, Text, useTheme } from 'react-native-paper';

import { formatDisplayDate, todayISO } from '@/core/utils/dates';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { WeekChart } from '@/features/dashboard/components/WeekChart';
import { useDashboard } from '@/features/dashboard/useDashboard';

export default function TodayScreen() {
  const theme = useTheme();
  const { today, week, goals, isLoading, error } = useDashboard();

  if (isLoading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleLarge" style={styles.date}>
          {formatDisplayDate(todayISO())}
        </Text>
        {error ? <HelperText type="error">{error}</HelperText> : null}

        <StatCard icon="walk" label="Steps" unit="steps" value={today.steps} goal={goals.steps} color={theme.colors.primary} />
        <StatCard icon="fire" label="Calories" unit="kcal" value={today.calories} goal={goals.calories} color={theme.colors.tertiary} />
        <StatCard icon="cup-water" label="Water" unit="ml" value={today.water} goal={goals.water} color={theme.colors.secondary} />

        <WeekChart days={week} goal={goals.steps} />
      </ScrollView>

      <FAB icon="plus" label="Add" style={styles.fab} onPress={() => router.push('/record/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 96 },
  date: { marginBottom: 12 },
  loading: { marginTop: 32 },
  fab: { position: 'absolute', right: 16, bottom: 16 },
});