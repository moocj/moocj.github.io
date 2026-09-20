import { describe, expect, it } from "vitest";

import { formatRelativeTime } from "./relative-time.js";

const NOW = Date.UTC(2026, 8, 20, 12, 0, 0);

describe("formatRelativeTime", () => {
  it("says 'just now' while the event is still under a minute old", () => {
    expect(formatRelativeTime(NOW - 59_999, NOW)).toBe("just now");
  });

  it("calls a whole minute a minute rather than 'just now'", () => {
    expect(formatRelativeTime(NOW - 60_000, NOW)).toBe("1 minute ago");
  });

  it("counts ninety minutes down to one hour instead of rounding up to two", () => {
    expect(formatRelativeTime(NOW - 90 * 60_000, NOW)).toBe("1 hour ago");
  });

  it("treats a timestamp slightly in the future as 'just now', never a negative count", () => {
    expect(formatRelativeTime(NOW + 30_000, NOW)).toBe("just now");
  });
});