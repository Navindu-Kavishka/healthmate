import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from 'expo-router';
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