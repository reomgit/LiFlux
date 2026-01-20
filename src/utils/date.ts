import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
  parseISO,
} from 'date-fns';

export function formatNoteDate(dateString: string): string {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return format(date, 'h:mm a');
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  if (isThisWeek(date)) {
    return format(date, 'EEEE');
  }

  if (isThisYear(date)) {
    return format(date, 'MMM d');
  }

  return format(date, 'MMM d, yyyy');
}

export function formatRelativeTime(dateString: string): string {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function getCurrentISOString(): string {
  return new Date().toISOString();
}

export function formatFullDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'MMMM d, yyyy \'at\' h:mm a');
}
