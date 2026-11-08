import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function RecordsScreen() {
  return (
    <View style={styles.screen}>
      <Text variant="headlineSmall">History</Text>
      <Text variant="bodyMedium">History View.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});