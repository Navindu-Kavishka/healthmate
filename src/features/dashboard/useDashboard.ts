import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { addDays, todayISO } from '@/core/utils/dates';
import { useGoalStore } from '@/features/goals/goalStore';
import { addEntry, deleteEntry, getDailyTotals, getEntriesForDate, getTotalsForDate } from '@/features/records/recordRepository';
import { EMPTY_TOTALS, type DayTotals, type EntryMetric, type RecordEntry, type Totals } from '@/features/records/types';
import { fillMissingDays } from './dashboardMath';
import { formatNumber } from '@/core/utils/format';
import { useSnackbarStore } from '@/core/ui/snackbarStore';

const QUICK_ADD_NOTE = 'Quick add';

//ViewModel for the Today tab: today's totals, the log behind them, the last 7 days, and goals
export function useDashboard() {
  const goals = useGoalStore((state) => state.goals);
  const loadGoals = useGoalStore((state) => state.loadGoals);
  const showMessage = useSnackbarStore((state) => state.showMessage);

  const [today, setToday] = useState<Totals>(EMPTY_TOTALS);
  const [entries, setEntries] = useState<RecordEntry[]>([]);
  const [week, setWeek] = useState<DayTotals[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const date = todayISO();
    try {
      // Independent queries, run at the same time.
      const [todayTotals, todayEntries, weekTotals] = await Promise.all([
        getTotalsForDate(date),
        getEntriesForDate(date),
        getDailyTotals(addDays(date, -6), date),
        loadGoals(),
      ]);
      setToday(todayTotals);
      setEntries(todayEntries);
      setWeek(fillMissingDays(weekTotals, date));
      setError(null);
    } catch (loadError) {
      console.error(loadError);
      setError('Could not load your totals.');
    } finally {
      setIsLoading(false);
    }
  }, [loadGoals]);

  // run each time the tab is shown, so totals include records added on other screens.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  // Writes one entry and its total, then re-reads the day so the card and the log agree.
  const logEntry = useCallback(
    async (metric: EntryMetric, amount: number, note: string | null = null): Promise<RecordEntry | null> => {
      try {
        const entry = await addEntry(todayISO(), metric, amount, note);
        await refresh();
        return entry;
      } catch (writeError) {
        console.error(writeError);
        showMessage('Could not save that entry');
        return null;
      }
    },
    [refresh, showMessage],
  );

  // One chip tap: one entry, and one action that takes it back.
  const quickAddWater = useCallback(
    async (amount: number) => {
      const entry = await logEntry('water', amount, QUICK_ADD_NOTE);
      if (!entry) return;

      let isUndone = false;
      showMessage(`${formatNumber(amount)} ml added`, {
        label: 'Undo',
        run: async () => {
          if (isUndone) return; // a second tap must not subtract twice
          isUndone = true;
          try {
            await deleteEntry(entry.id);
            await refresh();
          } catch (undoError) {
            console.error(undoError);
            showMessage('Could not undo that entry');
          }
        },
      });
    },
    [logEntry, refresh, showMessage],
  );

  return { today, entries, week, goals, isLoading, error, logEntry, quickAddWater };
}