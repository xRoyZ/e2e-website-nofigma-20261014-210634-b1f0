// Entry point of the café website.
//
// Imports every feature module, fills the header from SITE and calls each
// module once with its container element. No module touches the DOM at import
// time, and neither does this one: the wiring runs only when a document exists.

import { SITE } from "./site-config.js";
import { initMenu } from "./menu.js";
import { initHours } from "./hours.js";
import { initLocation } from "./location.js";
import { initContact } from "./contact.js";
import { initFooter } from "./footer.js";

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

function boot() {
  setText("site-name", SITE.name);
  setText("site-tagline", SITE.tagline);

  const containers = {
    menu: document.getElementById("menu-content"),
    hours: document.getElementById("hours-content"),
    location: document.getElementById("location-content"),
    contact: document.getElementById("contact-content"),
    footer: document.getElementById("footer-content"),
  };

  if (containers.menu) initMenu(containers.menu);
  if (containers.hours) initHours(containers.hours);
  if (containers.location) initLocation(containers.location);
  if (containers.contact) initContact(containers.contact);
  if (containers.footer) initFooter(containers.footer);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
}

export { boot };
