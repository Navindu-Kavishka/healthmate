// goal progress number (0-1)
export function progressTowards(value: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(value / goal, 1);
}