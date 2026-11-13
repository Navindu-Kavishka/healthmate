import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, HelperText, Searchbar, SegmentedButtons, Text } from 'react-native-paper';

import { formatDisplayDate } from '@/core/utils/dates';
import { formatNumber } from '@/core/utils/format';
import { useRecordStore } from '@/features/records/recordStore';
import type { SortOption } from '@/features/records/types';

const SORT_BUTTONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'mostSteps', label: 'Most steps' },
];

export default function RecordsScreen() {
  const records = useRecordStore((state) => state.records);
  const search = useRecordStore((state) => state.search);
  const sort = useRecordStore((state) => state.sort);
  const isLoading = useRecordStore((state) => state.isLoading);
  const error = useRecordStore((state) => state.error);
  const loadRecords = useRecordStore((state) => state.loadRecords);
  const setSearch = useRecordStore((state) => state.setSearch);
  const setSort = useRecordStore((state) => state.setSort);

  // Reload every time this tab comes into view (like after adding a record)
  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords]),
  );

  const emptyList = isLoading ? (
    <ActivityIndicator style={styles.loading} />
  ) : (
    <Text style={styles.empty}>{search ? 'No matching records' : 'No records yet'}</Text>
  );

  return (
    <View style={styles.screen}>
      <Searchbar
        placeholder="Search by date, e.g. 2026-11"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      <SegmentedButtons
        value={sort}
        onValueChange={(value) => setSort(value as SortOption)}
        buttons={SORT_BUTTONS}
        style={styles.sort}
      />
      {error ? <HelperText type="error">{error}</HelperText> : null}

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
        ListEmptyComponent={emptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  search: { marginHorizontal: 16, marginTop: 12 },
  sort: { marginHorizontal: 16, marginVertical: 12 },
  loading: { marginTop: 32 },
  empty: { textAlign: 'center', marginTop: 32 },
  card: { marginHorizontal: 16, marginVertical: 6 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between' },
});