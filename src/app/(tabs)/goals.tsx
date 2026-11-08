import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function GoalsScreen() {
  return (
    <View style={styles.screen}>
      <Text variant="headlineSmall">Goals</Text>
      <Text variant="bodyMedium">Goals View.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});