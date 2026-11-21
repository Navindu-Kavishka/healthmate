import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, FAB, HelperText, Searchbar, SegmentedButtons, Text } from 'react-native-paper';

import { ConfirmDialog } from '@/core/ui/ConfirmDialog';
import { EmptyState } from '@/core/ui/EmptyState';
import { useSnackbarStore } from '@/core/ui/snackbarStore';
import { formatDisplayDate, parseISODate, toISODate, todayISO } from '@/core/utils/dates';
import { RecordCard } from '@/features/records/components/RecordCard';
import { useRecordStore } from '@/features/records/recordStore';
import { describeRecords } from '@/features/records/recordSummary';
import type { HealthRecord, SortOption } from '@/features/records/types';

const SORT_BUTTONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'mostSteps', label: 'Most steps' },
];

export default function RecordsScreen() {
  const records = useRecordStore((state) => state.records);
  const search = useRecordStore((state) => state.search);
  const from = useRecordStore((state) => state.from);
  const to = useRecordStore((state) => state.to);
  const sort = useRecordStore((state) => state.sort);
  const isLoading = useRecordStore((state) => state.isLoading);
  const error = useRecordStore((state) => state.error);
  const loadRecords = useRecordStore((state) => state.loadRecords);
  const setSearch = useRecordStore((state) => state.setSearch);
  const setRange = useRecordStore((state) => state.setRange);
  const setSort = useRecordStore((state) => state.setSort);
  const deleteRecord = useRecordStore((state) => state.deleteRecord);
  const showMessage = useSnackbarStore((state) => state.showMessage);

  // deleting wait for confirmation
  const [recordToDelete, setRecordToDelete] = useState<HealthRecord | null>(null);

  // which date the picker is setting right now, null when it is closed
  const [pickingRangeEnd, setPickingRangeEnd] = useState<'from' | 'to' | null>(null);

  const isFiltered = Boolean(search || from || to);

  function handleRangePicked(event: DateTimePickerEvent, pickedDate?: Date) {
    const end = pickingRangeEnd;
    setPickingRangeEnd(null);
    if (!end || event.type !== 'set' || !pickedDate) return;

    const isoDate = toISODate(pickedDate);
    if (end === 'from') setRange(isoDate, to);
    else setRange(from, isoDate);
  }

  // Reload every time this tab comes into view (like after adding a record)
  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords]),
  );

  async function confirmDelete() {
    if (!recordToDelete) return;
    const { id } = recordToDelete;
    setRecordToDelete(null);
    try {
      await deleteRecord(id);
      showMessage('Record deleted');
    } catch (deleteError) {
      console.error(deleteError);
      showMessage('Could not delete the record');
    }
  }

  const emptyList = isLoading ? (
    <ActivityIndicator style={styles.loading} />
  ) : (
    <EmptyState
      icon="calendar-search"
      title={isFiltered ? 'No matching records' : 'No records yet'}
      message={
        search ? 'Try a shorter search, such as 2026-11.'
        : from || to ? 'Try a wider date range.'
        : 'Tap Add to log your first day.'
      }
    />
  );

  return (
    <View style={styles.screen}>
      <Searchbar
        placeholder="Search by date, e.g. 2026-11"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      <View style={styles.rangeRow}>
        <Button
          compact
          mode="outlined"
          icon="calendar-start"
          style={styles.rangeButton}
          onPress={() => setPickingRangeEnd('from')}
        >
          {from ?? 'From'}
        </Button>
        <Button
          compact
          mode="outlined"
          icon="calendar-end"
          style={styles.rangeButton}
          onPress={() => setPickingRangeEnd('to')}
        >
          {to ?? 'To'}
        </Button>
        {from || to ? (
          <Button compact mode="text" onPress={() => setRange(null, null)}>
            Clear
          </Button>
        ) : null}
      </View>
      <SegmentedButtons
        value={sort}
        onValueChange={(value) => setSort(value as SortOption)}
        buttons={SORT_BUTTONS}
        style={styles.sort}
      />
      <Text variant="bodySmall" style={styles.summary}>
        {describeRecords(records)}
      </Text>
      {error ? <HelperText type="error">{error}</HelperText> : null}

      <FlatList
        data={records}
        keyExtractor={(record) => String(record.id)}
        renderItem={({ item }) => (
          <RecordCard
            record={item}
            onPress={() => router.push(`/day/${item.date}`)}
            onEdit={() => router.push(`/record/${item.id}`)}
            onDelete={() => setRecordToDelete(item)}
          />
        )}
        ListEmptyComponent={emptyList}
        contentContainerStyle={styles.list}
      />

      <FAB icon="plus" label="Add" style={styles.fab} onPress={() => router.push('/record/new')} />

      <ConfirmDialog
        visible={recordToDelete !== null}
        title="Delete this record?"
        message={recordToDelete ? `The entry for ${formatDisplayDate(recordToDelete.date)} will be removed for good.` : ''}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setRecordToDelete(null)}
      />

      {pickingRangeEnd ? (
        <DateTimePicker
          value={parseISODate((pickingRangeEnd === 'from' ? from : to) ?? todayISO()) ?? new Date()}
          mode="date"
          maximumDate={new Date()}
          onChange={handleRangePicked}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  search: { marginHorizontal: 16, marginTop: 12 },
  rangeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 12 },
  rangeButton: { flex: 1 },
  sort: { marginHorizontal: 16, marginVertical: 12 },
  summary: { marginHorizontal: 16, marginTop: -4, marginBottom: 8 },
  list: { paddingBottom: 96 }, // room so the last card isn't hidden behind the Add button
  loading: { marginTop: 32 },
  fab: { position: 'absolute', right: 16, bottom: 16 },
});