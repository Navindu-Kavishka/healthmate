import { useSnackbarStore } from '@/core/ui/snackbarStore';
import * as recordRepository from './recordRepository';
import type { RecordSnapshot } from './recordRepository';
import { useRecordStore } from './recordStore';
import type { HealthRecord, RecordEntry } from './types';

jest.mock('./recordRepository', () => ({
  getRecords: jest.fn(async () => []),
  addRecord: jest.fn(async () => 1),
  updateRecord: jest.fn(async () => {}),
  deleteRecord: jest.fn(async () => {}),
  snapshotRecord: jest.fn(async () => null),
  restoreRecord: jest.fn(async () => {}),
}));

const snapshotRecord = recordRepository.snapshotRecord as jest.Mock;
const deleteRecord = recordRepository.deleteRecord as jest.Mock;
const restoreRecord = recordRepository.restoreRecord as jest.Mock;

const record: HealthRecord = { id: 7, date: '2026-11-07', steps: 1_000, calories: 200, water: 500 };
const entries: RecordEntry[] = [
  { id: 3, recordId: 7, createdAt: '2026-11-07T08:00:00', metric: 'water', amount: 500, note: 'quick add' },
];
const snapshot: RecordSnapshot = { record, entries };

describe('recordStore.deleteRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRecordStore.setState({ records: [record], isLoading: false, error: null });
    useSnackbarStore.getState().hideMessage();
  });

  it('snapshots before deleting and offers undo', async () => {
    snapshotRecord.mockResolvedValue(snapshot);

    await useRecordStore.getState().deleteRecord(7);

    expect(snapshotRecord).toHaveBeenCalledWith(7);
    expect(deleteRecord).toHaveBeenCalledWith(7);
    expect(useSnackbarStore.getState().message).toBe('Record deleted');
    expect(useSnackbarStore.getState().action?.label).toBe('Undo');
  });

  it('restores the day and its entries once, even when undo runs twice', async () => {
    snapshotRecord.mockResolvedValue(snapshot);

    await useRecordStore.getState().deleteRecord(7);
    const undo = useSnackbarStore.getState().action;
    await undo?.run();
    await undo?.run(); // second tap

    expect(restoreRecord).toHaveBeenCalledTimes(1);
    expect(restoreRecord).toHaveBeenCalledWith(snapshot);
  });

  it('keeps no undo when the record was already gone', async () => {
    snapshotRecord.mockResolvedValue(null);

    await useRecordStore.getState().deleteRecord(7);

    expect(deleteRecord).toHaveBeenCalledWith(7);
    expect(useSnackbarStore.getState().message).toBeNull();
  });

  it('says so when the restore fails', async () => {
    snapshotRecord.mockResolvedValue(snapshot);
    restoreRecord.mockRejectedValueOnce(new Error('disk full'));
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    await useRecordStore.getState().deleteRecord(7);
    await useSnackbarStore.getState().action?.run();

    expect(useSnackbarStore.getState().message).toBe('Could not undo that delete');
    consoleError.mockRestore();
  });
});