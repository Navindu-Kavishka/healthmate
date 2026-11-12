import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { darkTheme, lightTheme, toNavigationTheme } from '@/core/theme/theme';

// wrap all functions
 export default function RootLayout() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={toNavigationTheme(theme)}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}