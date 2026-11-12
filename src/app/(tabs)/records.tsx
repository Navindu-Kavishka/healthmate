import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { formatDisplayDate } from '@/core/utils/dates';
import { formatNumber } from '@/core/utils/format';

// test data
const SAMPLE = [
  { id: 1, date: '2026-11-07', steps: 8450, calories: 2210, water: 1900 },
  { id: 2, date: '2026-11-06', steps: 6120, calories: 1980, water: 1600 },
  { id: 3, date: '2026-11-05', steps: 10240, calories: 2540, water: 2250 },
];

export default function RecordsScreen() {
  return (
    <View style={styles.screen}>
      <FlatList
        data={SAMPLE}
        keyExtractor={(record) => String(record.id)}
        renderItem={({ item }) => (
          <Card mode="elevated" style={styles.card}>
            <Card.Title title={formatDisplayDate(item.date)} titleVariant="titleMedium" />
            <Card.Content style={styles.metrics}>
              <Text>{formatNumber(item.steps)} steps</Text>
              <Text>{formatNumber(item.calories)} kcal</Text>
              <Text>{formatNumber(item.water)} ml</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  card: { marginHorizontal: 16, marginVertical: 6 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between' },
});