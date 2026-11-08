import { Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSnackbarStore } from './snackbarStore';

const TAB_BAR_HEIGHT = 56;


// Short sample message 
export function AppSnackbar() {
  const message = useSnackbarStore((state) => state.message);
  const hideMessage = useSnackbarStore((state) => state.hideMessage);
  const insets = useSafeAreaInsets();

  return (
    <Snackbar
      visible={message !== null}
      onDismiss={hideMessage}
      duration={3000}
      wrapperStyle={{ bottom: insets.bottom + TAB_BAR_HEIGHT }}
    >
      {message ?? ''}
    </Snackbar>
  );
}