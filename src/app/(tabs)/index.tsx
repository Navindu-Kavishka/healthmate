import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function TodayScreen() {
  return (
    <View style={styles.screen}>
      <Text variant="headlineSmall">Today</Text>
      <Text variant="bodyMedium">This is Today View.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});