
import { create } from 'zustand';

type SnackbarState = {
  message: string | null;
  showMessage: (message: string) => void;
  hideMessage: () => void;
};

export const useSnackbarStore = create<SnackbarState>()((set) => ({
  message: null,
  showMessage: (message) => set({ message }),
  hideMessage: () => set({ message: null }),
}));