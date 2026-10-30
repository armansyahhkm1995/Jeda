const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Returns current date as 'YYYY-MM-DD' in local time
 */
export function getTodayIsoString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if given ISO date string matches today
 */
export function isToday(dateIso: string | null | undefined): boolean {
  if (!dateIso) return false;
  return dateIso === getTodayIsoString();
}

/**
 * Format timestamp to 'HH:mm' string
 */
export function formatTime(timestamp: number = Date.now()): string {
  const d = new Date(timestamp);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format date ISO string to Indonesian human readable date
 * e.g. "Selasa, 13 Oktober 2026"
 */
export function formatIndonesianDate(dateIso: string): string {
  const [year, month, day] = dateIso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayName = INDONESIAN_DAYS[date.getDay()];
  const monthName = INDONESIAN_MONTHS[date.getMonth()];
  return `${dayName}, ${day} ${monthName} ${year}`;
}

/**
 * Format date ISO string without day name (e.g. "9 Oktober 2026")
 */
export function formatDateWithoutDay(dateIso: string): string {
  if (!dateIso) return '';
  const [year, month, day] = dateIso.split('-').map(Number);
  const monthName = INDONESIAN_MONTHS[month - 1] || '';
  return `${day} ${monthName} ${year}`;
}

/**
 * Format Month & Year (e.g. "Oktober 2026")
 */
export function formatMonthYear(year: number, monthZeroIndexed: number): string {
  const monthName = INDONESIAN_MONTHS[monthZeroIndexed] || '';
  return `${monthName} ${year}`;
}

/**
 * Get short Indonesian day name: 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'
 */
export function getShortDayName(dateIso: string): string {
  const [year, month, day] = dateIso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const shortDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  return shortDays[date.getDay()];
}

/**
 * Calculate week of the month (1..5)
 */
export function getWeekOfMonth(dateIso: string): number {
  const [year, month, day] = dateIso.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1).getDay();
  return Math.ceil((day + firstDay) / 7);
}

/**
 * Get all dates in a specified month as ISO strings 'YYYY-MM-DD'
 */
export function getDaysInMonth(year: number, monthZeroIndexed: number): string[] {
  const days: string[] = [];
  const date = new Date(year, monthZeroIndexed, 1);
  while (date.getMonth() === monthZeroIndexed) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${d}`);
    date.setDate(date.getDate() + 1);
  }
  return days;
}
