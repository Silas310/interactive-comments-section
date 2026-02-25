import {
  differenceInDays,
  formatDistanceToNowStrict,
  isValid,
  parseISO,
} from 'date-fns';

function parseDateInput(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }

  if (typeof value === 'number') {
    const dateFromNumber = new Date(value);
    return isValid(dateFromNumber) ? dateFromNumber : null;
  }

  if (typeof value === 'string') {
    const isoDate = parseISO(value);
    if (isValid(isoDate)) return isoDate;

    const fallback = new Date(value);
    return isValid(fallback) ? fallback : null;
  }

  return null;
}

export function formatTimeAgo(value) {
  const parsedDate = parseDateInput(value);
  if (!parsedDate) {
    if (typeof value === 'string' && value.includes('ago')) {
      return value;
    }
    return '';
  }

  const daysDiff = Math.abs(differenceInDays(new Date(), parsedDate));

  if (daysDiff >= 7 && daysDiff < 30) {
    const weeks = Math.floor(daysDiff / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }

  return formatDistanceToNowStrict(parsedDate, {
    addSuffix: true,
    roundingMethod: 'floor',
  });
}
