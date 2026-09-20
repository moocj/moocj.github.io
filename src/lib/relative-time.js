const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const DAYS_BEFORE_WEEKS = 14;

/**
 * Describe how long ago something happened, in words.
 *
 *
 * @param {number} thenMs when it happened, in milliseconds since the epoch
 * @param {number} nowMs what "now" is, in milliseconds since the epoch
 * @returns {string}
 */
export function formatRelativeTime(thenMs, nowMs) {
  const elapsed = nowMs - thenMs;

  if (elapsed < MINUTE) return "just now";
  if (elapsed < HOUR) return ago(Math.floor(elapsed / MINUTE), "minute");
  if (elapsed < DAY) return ago(Math.floor(elapsed / HOUR), "hour");
  if (elapsed < DAYS_BEFORE_WEEKS * DAY) return ago(Math.floor(elapsed / DAY), "day");
  return ago(Math.floor(elapsed / WEEK), "week");
}

function ago(count, unit) {
  return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
}