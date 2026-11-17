import { Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSnackbarStore } from './snackbarStore';

const TAB_BAR_HEIGHT = 56;


// Short sample message with undo action
export function AppSnackbar() {
  const message = useSnackbarStore((state) => state.message);
  const action = useSnackbarStore((state) => state.action);
  const hideMessage = useSnackbarStore((state) => state.hideMessage);
  const insets = useSafeAreaInsets();

  return (
    <Snackbar
      visible={message !== null}
      onDismiss={hideMessage}
      // Show the undo action for 5 seconds action button can tap, otherwise show for 3 seconds
      duration={ action ? 5000 : 3000}
      wrapperStyle={{ bottom: insets.bottom + TAB_BAR_HEIGHT }}
      action={
        action
          ? {
              label: action.label,
              onPress: () => {
                action.run();
                hideMessage();
              },
            }
          : undefined
      }
    >
      {message ?? ''}
    </Snackbar>
  );
}