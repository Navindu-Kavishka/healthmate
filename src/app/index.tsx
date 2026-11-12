import { formatDisplayDate, todayISO } from "@/core/utils/dates";
import { formatNumber } from "@/core/utils/format";
import { ScrollView, StyleSheet } from "react-native";
import { Card, ProgressBar, Text, useTheme } from "react-native-paper";


const TODAY = { steps: 12500, calories: 2500, water: 1800 };
const GOALS = { steps: 15000, calories: 3000, water: 2000 };

export default function TodayScreen() {
    const theme = useTheme();

    return (
        <ScrollView >
            <Text variant="titleLarge" style={styles.date}>
                {formatDisplayDate(todayISO())}
            </Text>
            <Card mode="contained" style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <Text variant="titleMedium">Steps</Text>
                    <Text variant="headlineMedium">
                        {formatNumber(TODAY.steps)}
                        <Text variant="bodyMedium"> steps</Text>
                    </Text>
                    <ProgressBar progress={TODAY.steps / GOALS.steps} color={theme.colors.primary} style={styles.bar} />
                    <Text variant="bodySmall">
                        {Math.round((TODAY.steps / GOALS.steps) * 100)}% of {formatNumber(GOALS.steps)} steps
                    </Text>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  date: { marginBottom: 12 },
  card: { marginBottom: 12 },
  cardContent: { gap: 6 },
  bar: { height: 8, borderRadius: 4 },
});