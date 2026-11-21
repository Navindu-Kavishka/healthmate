import { formatNumber } from './format';

// check text type into number
export function wholeNumberError(
  text: string,
  label: string,
  max: number,
  min = 0,
): string | undefined {
  const trimmed = text.trim();

  if (trimmed === '') return `${label} is required`;
  if (!/^\d+$/.test(trimmed)) return `${label} must be a whole number`;

  const value = Number(trimmed);
  if (value < min) return `${label} must be at least ${formatNumber(min)}`;
  if (value > max) return `${label} must be ${formatNumber(max)} or less`;

  return undefined;
}