import * as Haptics from 'expo-haptics';

// small buzz so the user knows the tap worked, before the save.
// web and some old phones have no haptics, the promise fails and we ignore it
export function tapFeedback(): void {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}