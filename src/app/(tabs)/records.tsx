import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text } from 'react-native-paper';

import { formatDisplayDate } from '@/core/utils/dates';
import { formatNumber } from '@/core/utils/format';
import { getRecords } from '@/features/records/recordRepository';
import type { HealthRecord } from '@/features/records/types';

export default function RecordsScreen() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // first load get all records from the database
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const rows = await getRecords();
        if (!isCancelled) setRecords(rows);
      } catch (error) {
        console.error(error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={records}
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
  loading: { marginTop: 32 },
  card: { marginHorizontal: 16, marginVertical: 6 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between' },
});