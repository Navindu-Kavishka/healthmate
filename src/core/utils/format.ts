// 12500 -> 12,500
export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString('en-GB');
}