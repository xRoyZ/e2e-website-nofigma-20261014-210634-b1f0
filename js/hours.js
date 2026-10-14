// Opening-hours section.
//
// Renders the seven weekdays from SITE.openingHours, highlights today's row
// and shows the live open/closed status. All texts are written as DOM text
// nodes (textContent), never as HTML.

import { SITE } from "./site-config.js";
import {
  WEEKDAYS,
  weekdayKey,
  isOpenAt,
  formatRange,
} from "./lib/opening-hours.js";

const WEEKDAY_LABELS = {
  monday: "Montag",
  tuesday: "Dienstag",
  wednesday: "Mittwoch",
  thursday: "Donnerstag",
  friday: "Freitag",
  saturday: "Samstag",
  sunday: "Sonntag",
};

const OPEN_LABEL = "jetzt geöffnet";
const CLOSED_LABEL = "geschlossen";

function buildStatus(open) {
  const status = document.createElement("p");
  status.className = `hours-status ${
    open ? "hours-status--open" : "hours-status--closed"
  }`;
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  const dot = document.createElement("span");
  dot.className = "hours-status__dot";
  dot.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.className = "hours-status__label";
  label.textContent = open ? OPEN_LABEL : CLOSED_LABEL;

  status.append(dot, label);
  return status;
}

function buildList(openingHours, today) {
  const list = document.createElement("ul");
  list.className = "hours-list";

  for (const key of WEEKDAYS) {
    const item = document.createElement("li");
    item.className = "hours-row";
    const isToday = key === today;
    if (isToday) {
      item.classList.add("hours-row--today");
    }

    const day = document.createElement("span");
    day.className = "hours-row__day";
    day.textContent = isToday
      ? `${WEEKDAY_LABELS[key]} (heute)`
      : WEEKDAY_LABELS[key];

    const time = document.createElement("span");
    time.className = "hours-row__time";
    time.textContent = formatRange(openingHours[key]);

    item.append(day, time);
    list.appendChild(item);
  }

  return list;
}

export function initHours(root, now = new Date()) {
  if (!root) {
    return;
  }

  const openingHours = SITE.openingHours || {};
  const open = isOpenAt(openingHours, now);

  root.textContent = "";
  root.appendChild(buildStatus(open));
  root.appendChild(buildList(openingHours, weekdayKey(now)));
}
