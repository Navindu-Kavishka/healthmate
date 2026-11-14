import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { formatNumber } from '@/core/utils/format';
import { useGoalStore } from '@/features/goals/goalStore';

export default function GoalsScreen() {
  const goals = useGoalStore((state) => state.goals);
  const isLoaded = useGoalStore((state) => state.isLoaded);
  const loadGoals = useGoalStore((state) => state.loadGoals);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // Wait for the saved goals, so the screen never shows the defaults by mistake.
  if (!isLoaded) {
    return <ActivityIndicator style={styles.loading} />;
  }

  return (
    <View style={styles.content}>
      <Text variant="bodyMedium" style={styles.intro}>
        These targets are read from the database. The next step makes them editable.
      </Text>
      <Text variant="titleMedium">Steps: {formatNumber(goals.steps)}</Text>
      <Text variant="titleMedium">Calories: {formatNumber(goals.calories)}</Text>
      <Text variant="titleMedium">Water: {formatNumber(goals.water)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 8 },
  intro: { marginBottom: 8 },
  loading: { marginTop: 32 },
});