import { StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

type Props = {
  icon: string;
  title: string;
  message: string;
};

// Component to display an empty state with an icon, title, and message
export function EmptyState({ icon, title, message }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Icon source={icon} size={56} color={theme.colors.outline} />
      <Text variant="titleMedium">{title}</Text>
      <Text variant="bodyMedium" style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
        {message}
      </Text>
    </View>
  );
}

// Styles for the EmptyState component
const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 8, padding: 32 },
  message: { textAlign: 'center' },
});

