// Menu slice tests: pure grouping and price formatting.
// These import js/menu.js directly (no DOM), so they run under `node --test`.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { groupByCategory, formatPrice } from "../js/menu.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const NBSP = "\u00a0";

test("formatPrice uses German convention with two decimals and €", () => {
  assert.equal(formatPrice(8.5), `8,50${NBSP}€`);
  assert.equal(formatPrice(3), `3,00${NBSP}€`);
  assert.equal(formatPrice(9.8), `9,80${NBSP}€`);
  assert.equal(formatPrice(2.4), `2,40${NBSP}€`);
});

test("groupByCategory keeps file order and attaches dishes", () => {
  const categories = [
    { name: "Kaffee", items: [{ name: "Espresso", description: "stark", price: 2.4 }] },
    { name: "Kuchen", items: [{ name: "Apfelkuchen", description: "mit Zimt", price: 3.9 }] },
  ];
  const grouped = groupByCategory(categories);
  assert.deepEqual(
    grouped.map((category) => category.name),
    ["Kaffee", "Kuchen"],
  );
  assert.equal(grouped[0].items.length, 1);
  assert.equal(grouped[0].items[0].name, "Espresso");
  assert.equal(grouped[0].items[0].description, "stark");
  assert.equal(grouped[0].items[0].formattedPrice, `2,40${NBSP}€`);
  assert.equal(grouped[1].items[0].formattedPrice, `3,90${NBSP}€`);
});

test("groupByCategory tolerates unexpected input", () => {
  assert.deepEqual(groupByCategory(undefined), []);
  assert.deepEqual(groupByCategory("nope"), []);
});

test("data/menu.json has at least four categories with well-formed dishes", () => {
  const payload = JSON.parse(readFileSync(join(root, "data", "menu.json"), "utf8"));
  assert.ok(Array.isArray(payload.categories));
  assert.ok(payload.categories.length >= 4);

  for (const category of payload.categories) {
    assert.equal(typeof category.name, "string");
    assert.ok(category.name.length > 0);
    assert.ok(Array.isArray(category.items));
    assert.ok(category.items.length > 0);
    for (const item of category.items) {
      assert.equal(typeof item.name, "string");
      assert.equal(typeof item.description, "string");
      assert.equal(typeof item.price, "number");
      assert.ok(Number.isFinite(item.price));
      assert.ok(item.price > 0);
    }
  }
});
