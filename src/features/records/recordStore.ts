import { create } from 'zustand';

import { useSnackbarStore } from '@/core/ui/snackbarStore';
import * as recordRepository from './recordRepository';
import type { HealthRecord, NewHealthRecord, SortOption } from './types';

type RecordState = {
  records: HealthRecord[];
  search: string;
  from: string | null; // "YYYY-MM-DD", both ends included, null = not set
  to: string | null;
  sort: SortOption;
  isLoading: boolean;
  error: string | null;

  loadRecords: () => Promise<void>;
  setSearch: (search: string) => Promise<void>;
  setRange: (from: string | null, to: string | null) => Promise<void>;
  setSort: (sort: SortOption) => Promise<void>;
  addRecord: (record: NewHealthRecord) => Promise<void>;
  deleteRecord: (id: number) => Promise<void>;
  updateRecord: (record: HealthRecord) => Promise<void>;
};

// counter to track the latest request, we don't overwrite the state with an old request's result.
// store only last request result
let latestRequest = 0;

// ViewModel for records: the state the screens draw, plus the actions they call. 
export const useRecordStore = create<RecordState>()((set, get) => ({
  records: [],
  search: '',
  from: null,
  to: null,
  sort: 'newest',
  isLoading: false,
  error: null,

  loadRecords: async () => {
    const request = ++latestRequest;
    set({ isLoading: true, error: null });
    try {
      const { search, from, to, sort } = get();
      const records = await recordRepository.getRecords({ text: search, from, to, sort });
      if (request === latestRequest) set({ records, isLoading: false });
    } catch (error) {
      console.error(error);
      if (request === latestRequest) set({ error: 'Could not load your records.', isLoading: false });
    }
  },

  setSearch: async (search) => {
    set({ search });
    await get().loadRecords();
  },

  setRange: async (from, to) => {
    set({ from, to });
    await get().loadRecords();
  },

  setSort: async (sort) => {
    set({ sort });
    await get().loadRecords();
  },

  addRecord: async (record) => {
    await recordRepository.addRecord(record);
    await get().loadRecords();
  },

    updateRecord: async (record) => {
      await recordRepository.updateRecord(record);
      await get().loadRecords();
    },

  deleteRecord: async (id) => {
    // keep a copy first, Undo needs it
    const snapshot = await recordRepository.snapshotRecord(id);
    await recordRepository.deleteRecord(id);
    await get().loadRecords();

    if (!snapshot) return;

    let isUndone = false;
    useSnackbarStore.getState().showMessage('Record deleted', {
      label: 'Undo',
      run: async () => {
        if (isUndone) return; // double tap, already restored
        isUndone = true;
        try {
          await recordRepository.restoreRecord(snapshot);
          await get().loadRecords();
        } catch (undoError) {
          console.error(undoError);
          useSnackbarStore.getState().showMessage('Could not undo that delete');
        }
      },
    });
  },
}));