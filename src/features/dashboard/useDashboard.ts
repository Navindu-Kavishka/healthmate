import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { addDays, todayISO } from '@/core/utils/dates';
import { useGoalStore } from '@/features/goals/goalStore';
import { getDailyTotals, getEntriesForDate, getTotalsForDate } from '@/features/records/recordRepository';
import { EMPTY_TOTALS, type DayTotals, type RecordEntry, type Totals } from '@/features/records/types';
import { fillMissingDays } from './dashboardMath';

//ViewModel for the Today tab: today's totals, the log behind them, the last 7 days, and goals
export function useDashboard() {
  const goals = useGoalStore((state) => state.goals);
  const loadGoals = useGoalStore((state) => state.loadGoals);

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

  return { today, entries, week, goals, isLoading, error };
}