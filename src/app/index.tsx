import { ScrollView, StyleSheet } from 'react-native';
import { Card, ProgressBar, Text, useTheme } from 'react-native-paper';

import { formatDisplayDate, todayISO } from '@/core/utils/dates';
import { formatNumber } from '@/core/utils/format';

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

      <Card mode="contained" style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleMedium">Steps</Text>
          <Text variant="headlineMedium">
            {formatNumber(TODAY.steps)}
            <Text variant="bodyMedium"> steps</Text>
          </Text>
          <ProgressBar progress={TODAY.steps / GOALS.steps} color={theme.colors.primary} style={styles.bar} />
          <Text variant="bodySmall">
            {Math.round((TODAY.steps / GOALS.steps) * 100)}% of {formatNumber(GOALS.steps)} steps
          </Text>
        </Card.Content>
      </Card>

      <Card mode="contained" style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleMedium">Calories</Text>
          <Text variant="headlineMedium">
            {formatNumber(TODAY.calories)}
            <Text variant="bodyMedium"> kcal</Text>
          </Text>
          <ProgressBar progress={TODAY.calories / GOALS.calories} color={theme.colors.tertiary} style={styles.bar} />
          <Text variant="bodySmall">
            {Math.round((TODAY.calories / GOALS.calories) * 100)}% of {formatNumber(GOALS.calories)} kcal
          </Text>
        </Card.Content>
      </Card>

      <Card mode="contained" style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleMedium">Water</Text>
          <Text variant="headlineMedium">
            {formatNumber(TODAY.water)}
            <Text variant="bodyMedium"> ml</Text>
          </Text>
          <ProgressBar progress={TODAY.water / GOALS.water} color={theme.colors.secondary} style={styles.bar} />
          <Text variant="bodySmall">
            {Math.round((TODAY.water / GOALS.water) * 100)}% of {formatNumber(GOALS.water)} ml
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  date: { marginBottom: 12 },
  card: { marginBottom: 12 },
  cardContent: { gap: 6 },
  bar: { height: 8, borderRadius: 4 },
});