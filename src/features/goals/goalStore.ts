import { create } from 'zustand';

import * as goalRepository from './goalRepository';
import { DEFAULT_GOALS, type Goals } from './types';

type GoalState = {
  goals: Goals;
  isLoaded: boolean;
  loadGoals: () => Promise<void>;
  saveGoals: (goals: Goals) => Promise<void>;
};

// shared by the Today tab (shows progress) and the Goals tab (edits the targets).
export const useGoalStore = create<GoalState>()((set) => ({
  goals: DEFAULT_GOALS,
  isLoaded: false,

  loadGoals: async () => {
    try {
      const goals = await goalRepository.getGoals();
      set({ goals, isLoaded: true });
    } catch (error) {
      console.error(error);
      set({ isLoaded: true }); // keep the defaults so the screens still work
    }
  },

  saveGoals: async (goals) => {
    await goalRepository.saveGoals(goals);
    set({ goals });
  },
}));