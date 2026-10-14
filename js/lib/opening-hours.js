// Pure opening-hours logic.
//
// Node-importable and free of any DOM access so it can be unit-tested with
// `node --test`. Every function takes the opening-hours map explicitly; the
// caller passes SITE.openingHours. Weekdays are keyed by their English name
// ('monday' ... 'sunday') because that is the shape of SITE.openingHours.

export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// getDay() returns 0 for Sunday; keep the two orders in sync here.
const DAY_INDEX = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

// The closed-note text is part of the product's shown values (DESIGN.md).
export const CLOSED_LABEL = "geschlossen";

const EN_DASH = "\u2013";

export function weekdayKey(date) {
  return DAY_INDEX[date.getDay()];
}

function toMinutes(time) {
  if (typeof time !== "string") {
    return NaN;
  }
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) {
    return NaN;
  }
  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  if (hours > 23 || minutes > 59) {
    return NaN;
  }
  return hours * 60 + minutes;
}

export function todaysHours(openingHours, now) {
  if (!openingHours) {
    return null;
  }
  const hours = openingHours[weekdayKey(now)];
  return hours || null;
}

export function isOpenAt(openingHours, now) {
  const hours = todaysHours(openingHours, now);
  if (!hours) {
    return false;
  }
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  if (Number.isNaN(open) || Number.isNaN(close)) {
    return false;
  }
  // Opening minute counts as open; the closing minute already counts as closed.
  const current = now.getHours() * 60 + now.getMinutes();
  return current >= open && current < close;
}

export function formatRange(hours) {
  if (!hours) {
    return CLOSED_LABEL;
  }
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  if (Number.isNaN(open) || Number.isNaN(close)) {
    return CLOSED_LABEL;
  }
  return `${hours.open}${EN_DASH}${hours.close}`;
}
