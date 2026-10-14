// Tests for the pure opening-hours logic (kein DOM, no browser needed).

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  WEEKDAYS,
  weekdayKey,
  todaysHours,
  isOpenAt,
  formatRange,
} from "../js/lib/opening-hours.js";
import { SITE } from "../js/site-config.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const HOURS = {
  monday: { open: "08:00", close: "18:00" },
  tuesday: { open: "08:00", close: "18:00" },
  wednesday: { open: "08:00", close: "18:00" },
  thursday: { open: "08:00", close: "18:00" },
  friday: { open: "08:00", close: "19:00" },
  saturday: { open: "09:00", close: "19:00" },
  sunday: null,
};

// Local-time constructor: 2026-01-05 is a Monday.
const monday = (h, m) => new Date(2026, 0, 5, h, m);
const sunday = (h, m) => new Date(2026, 0, 4, h, m);

test("weekdayKey maps every local weekday to its English key", () => {
  const dates = [
    [new Date(2026, 0, 4), "sunday"],
    [new Date(2026, 0, 5), "monday"],
    [new Date(2026, 0, 6), "tuesday"],
    [new Date(2026, 0, 7), "wednesday"],
    [new Date(2026, 0, 8), "thursday"],
    [new Date(2026, 0, 9), "friday"],
    [new Date(2026, 0, 10), "saturday"],
  ];
  for (const [date, key] of dates) {
    assert.equal(weekdayKey(date), key);
  }
});

test("todaysHours returns the range for the current weekday", () => {
  assert.deepEqual(todaysHours(HOURS, monday(10, 0)), {
    open: "08:00",
    close: "18:00",
  });
  assert.equal(todaysHours(HOURS, sunday(10, 0)), null);
});

test("isOpenAt is false before opening", () => {
  assert.equal(isOpenAt(HOURS, monday(7, 59)), false);
});

test("isOpenAt is true exactly at opening time", () => {
  assert.equal(isOpenAt(HOURS, monday(8, 0)), true);
});

test("isOpenAt is false exactly at closing time", () => {
  assert.equal(isOpenAt(HOURS, monday(18, 0)), false);
});

test("isOpenAt is true just before closing time", () => {
  assert.equal(isOpenAt(HOURS, monday(17, 59)), true);
});

test("isOpenAt is false after closing", () => {
  assert.equal(isOpenAt(HOURS, monday(18, 1)), false);
});

test("isOpenAt is false on a closed weekday at any time", () => {
  assert.equal(isOpenAt(HOURS, sunday(12, 0)), false);
  assert.equal(isOpenAt(HOURS, sunday(23, 59)), false);
});

test("isOpenAt tolerates missing days and malformed values", () => {
  assert.equal(isOpenAt({}, monday(10, 0)), false);
  assert.equal(isOpenAt(null, monday(10, 0)), false);
  assert.equal(
    isOpenAt({ monday: { open: "8:00", close: "xx" } }, monday(10, 0)),
    false,
  );
});

test("formatRange uses the 24-hour en-dash format", () => {
  assert.equal(formatRange({ open: "07:30", close: "18:00" }), "07:30\u201318:00");
  assert.equal(formatRange({ open: "09:00", close: "19:00" }), "09:00\u201319:00");
});

test("formatRange marks a closed day as geschlossen", () => {
  assert.equal(formatRange(null), "geschlossen");
});

test("WEEKDAYS is ordered Monday to Sunday", () => {
  assert.deepEqual(WEEKDAYS, [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]);
});

test("SITE.openingHours uses the weekday keys the logic reads", () => {
  for (const key of WEEKDAYS) {
    assert.ok(key in SITE.openingHours, `missing ${key}`);
  }
  assert.ok(SITE.openingHours.sunday === null);
});

test("the lib module is importable without a DOM", async () => {
  await import(join(root, "js", "lib", "opening-hours.js"));
});
