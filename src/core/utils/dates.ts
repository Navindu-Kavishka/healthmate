//Date format: YYYY-MM-DD
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//return local time string date format "YYYY-MM-DD"
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

//REtiurn today date in format "YYYY-MM-DD"
export function todayISO(): string {
  return toISODate(new Date());
}

//Date at lical midnight or null
export function parseISODate(text: string): Date | null {
  if (!ISO_DATE_PATTERN.test(text)) return null;

  const [year, month, day] = text.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  // new Date(2026, 1, 30)
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isRealDate ? date : null;
}

// move date forward
export function addDays(isoDate: string, days: number): string {
  const date = parseISODate(isoDate);
  if (!date) throw new Error(`Invalid date: ${isoDate}`);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

//"2026-11-07" to "Sat, 7 Nov 2026"
export function formatDisplayDate(isoDate: string): string {
  const date = parseISODate(isoDate);
  if (!date) return isoDate;
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}