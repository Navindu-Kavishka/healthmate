
import { create } from 'zustand';
export type SnackbarAction = {label: string; run: () => void};


type SnackbarState = {
  message: string | null;
  action: SnackbarAction | null;
  showMessage: (message: string, action?: SnackbarAction) => void;
  hideMessage: () => void;
};

export const useSnackbarStore = create<SnackbarState>()((set) => ({
  message: null,
  action: null, 
  showMessage: (message,action) => set({ message,action: action ?? null }),
  hideMessage: () => set({ message: null, action: null }),
}));