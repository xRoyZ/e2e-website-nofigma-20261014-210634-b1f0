// Skeleton shell tests: navigation wiring and feature-module contracts.
// These assert what the shell PROMISES (structure and exports), never the
// temporary body of a stub.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");

const anchors = [
  ["#menu", "menu"],
  ["#opening-hours", "opening-hours"],
  ["#location", "location"],
  ["#contact", "contact"],
];

test("index.html has a navigation anchor for every section", () => {
  for (const [href, id] of anchors) {
    assert.ok(
      html.includes(`href="${href}"`),
      `missing navigation link to ${href}`,
    );
    assert.ok(
      html.includes(`id="${id}"`),
      `missing section element with id ${id}`,
    );
  }
});

test("index.html has every feature container the modules fill", () => {
  for (const id of [
    "menu-content",
    "hours-content",
    "location-content",
    "contact-content",
    "footer-content",
    "site-name",
    "site-tagline",
  ]) {
    assert.ok(html.includes(`id="${id}"`), `missing container #${id}`);
  }
});

test("index.html loads main.js as a module", () => {
  assert.match(html, /<script\s+type="module"\s+src="js\/main\.js"><\/script>/);
});

test("site-config exposes the shared SITE shape", async () => {
  const { SITE } = await import(join(root, "js", "site-config.js"));
  assert.equal(typeof SITE.name, "string");
  assert.ok(SITE.name.length > 0);
  assert.equal(typeof SITE.tagline, "string");
  assert.equal(typeof SITE.address.street, "string");
  assert.equal(typeof SITE.address.postalCode, "string");
  assert.equal(typeof SITE.address.city, "string");
  assert.equal(typeof SITE.phone, "string");
  assert.equal(typeof SITE.email, "string");
  assert.equal(typeof SITE.mapUrl, "string");
});

test("every feature module exports its init function", async () => {
  const expected = [
    ["menu.js", "initMenu"],
    ["hours.js", "initHours"],
    ["location.js", "initLocation"],
    ["contact.js", "initContact"],
    ["footer.js", "initFooter"],
  ];
  for (const [file, name] of expected) {
    const mod = await import(join(root, "js", file));
    assert.equal(
      typeof mod[name],
      "function",
      `${file} must export ${name} as a function`,
    );
    assert.ok(mod[name].length >= 1, `${name} must accept a root element`);
  }
});
