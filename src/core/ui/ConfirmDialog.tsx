import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// confirmation dialog for deleting
export function ConfirmDialog({ visible, title, message, confirmLabel, onConfirm, onCancel }: Props) {
  const theme = useTheme();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>Cancel</Button>
          <Button textColor={theme.colors.error} onPress={onConfirm}>
            {confirmLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}