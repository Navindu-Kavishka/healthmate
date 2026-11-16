import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { GoalsForm } from '@/features/goals/components/GoalsForm';
import { useGoalStore } from '@/features/goals/goalStore';

export default function GoalsScreen() {
  const goals = useGoalStore((state) => state.goals);
  const isLoaded = useGoalStore((state) => state.isLoaded);
  const loadGoals = useGoalStore((state) => state.loadGoals);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // Wait for the saved goals, so the form starts with the right numbers.
  if (!isLoaded) {
    return <ActivityIndicator style={styles.loading} />;
  }

  return <GoalsForm initialGoals={goals} />;
}

const styles = StyleSheet.create({
  loading: { marginTop: 32 },
});