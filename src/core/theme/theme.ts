import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from 'expo-router';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#006A60',
    onPrimary: '#FFFFFF',
    primaryContainer: '#9EF2E4',
    onPrimaryContainer: '#00201C',
    secondary: '#4A6360',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#CCE8E3',
    onSecondaryContainer: '#051F1C',
    tertiary: '#9A4600',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFDBC8',
    onTertiaryContainer: '#321200',
    background: '#F4FBF8',
    onBackground: '#161D1C',
    surface: '#F4FBF8',
    onSurface: '#161D1C',
    surfaceVariant: '#DAE5E1',
    onSurfaceVariant: '#3F4947',
    outline: '#6F7977',
    outlineVariant: '#BEC9C5',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#82D5C8',
    onPrimary: '#003731',
    primaryContainer: '#005048',
    onPrimaryContainer: '#9EF2E4',
    secondary: '#B1CCC7',
    onSecondary: '#1C3532',
    secondaryContainer: '#334B48',
    onSecondaryContainer: '#CCE8E3',
    tertiary: '#FFB68A',
    onTertiary: '#532200',
    tertiaryContainer: '#763300',
    onTertiaryContainer: '#FFDBC8',
    background: '#0E1513',
    onBackground: '#DDE4E1',
    surface: '#0E1513',
    onSurface: '#DDE4E1',
    surfaceVariant: '#3F4947',
    onSurfaceVariant: '#BEC9C5',
    outline: '#899390',
    outlineVariant: '#3F4947',
  },
};

// The three metric colours the brief names. Steps keep the theme's teal;
// calories and water get their own tokens so every screen agrees.
export type MetricColorKey = 'steps' | 'calories' | 'water';

export const metricColors: Record<'light' | 'dark', Record<MetricColorKey, string>> = {
  light: { steps: '#006A60', calories: '#B3261E', water: '#1565C0' },
  dark: { steps: '#82D5C8', calories: '#FFB4AB', water: '#A8C8FF' },
};

// same rule the app already uses: the system colour scheme picks the palette
export function useMetricColors(): Record<MetricColorKey, string> {
  const isDark = useColorScheme() === 'dark';
  return isDark ? metricColors.dark : metricColors.light;
}

// soft fill behind each stat card so the three cards look different
export const metricFills: Record<'light' | 'dark', Record<MetricColorKey, string>> = {
  light: { steps: '#9EF2E4', calories: '#FFDAD6', water: '#D8E2FF' },
  dark: { steps: '#005048', calories: '#93000A', water: '#00458F' },
};

export function useMetricFills(): Record<MetricColorKey, string> {
  const isDark = useColorScheme() === 'dark';
  return isDark ? metricFills.dark : metricFills.light;
}

// set my defined colors to navigation theme colors
export function toNavigationTheme(theme: MD3Theme): NavigationTheme {
  const base = theme.dark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outlineVariant,
    },
  };
}