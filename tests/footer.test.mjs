// Footer tests: the rendered footer text and legal links.
//
// js/footer.js is DOM code, so this file drives it with a minimal fake DOM
// instead of pulling in a dependency. It asserts the product's promises
// (AC-15, AC-20, AC-21): the contact details and the two legal blocks are
// present as TEXT, and the footer links to them.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { SITE } from "../js/site-config.js";
import { initFooter } from "../js/footer.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

class FakeNode {
  constructor(tag) {
    this.tagName = tag;
    this.children = [];
    this._text = "";
    this.className = "";
    this.id = "";
    this.href = "";
    this.attributes = {};
  }

  set textContent(value) {
    this.children = [];
    this._text = value === undefined || value === null ? "" : String(value);
  }

  get textContent() {
    return this._text + this.children.map((c) => c.textContent).join("");
  }

  append(...nodes) {
    for (const node of nodes) {
      if (typeof node === "string") {
        const text = new FakeNode("#text");
        text.textContent = node;
        this.children.push(text);
      } else {
        this.children.push(node);
      }
    }
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }
}

function collect(node, tag) {
  const found = [];
  if (node.tagName === tag) {
    found.push(node);
  }
  for (const child of node.children) {
    found.push(...collect(child, tag));
  }
  return found;
}

function render() {
  globalThis.document = {
    createElement: (tag) => new FakeNode(tag),
  };
  const anchor = new FakeNode("div");
  initFooter(anchor);
  return anchor;
}

test("footer names address, phone and contact address from SITE (AC-15)", () => {
  const tree = render();
  const text = tree.textContent;
  assert.ok(text.includes(SITE.address.street), "street missing");
  assert.ok(text.includes(SITE.address.postalCode), "postal code missing");
  assert.ok(text.includes(SITE.address.city), "city missing");
  assert.ok(text.includes(SITE.phone), "phone missing");
  assert.ok(text.includes(SITE.email), "contact address missing");
});

test("footer links to the Impressum and Datenschutz blocks (AC-20/AC-21)", () => {
  const tree = render();
  const links = collect(tree, "a").map((a) => a.href);
  assert.ok(links.includes("#impressum"), "no link to #impressum");
  assert.ok(links.includes("#datenschutz"), "no link to #datenschutz");

  const ids = collect(tree, "section").map((s) => s.id);
  assert.ok(ids.includes("impressum"), "missing #impressum block");
  assert.ok(ids.includes("datenschutz"), "missing #datenschutz block");
});

test("Impressum names the operator with address and contact (AC-20)", () => {
  const tree = render();
  const impressum = collect(tree, "section").find((s) => s.id === "impressum");
  const text = impressum.textContent;
  assert.ok(text.includes(SITE.name), "operator name missing");
  assert.ok(text.includes(SITE.address.street), "operator address missing");
  assert.ok(
    text.includes(SITE.phone) && text.includes(SITE.email),
    "operator contact missing",
  );
});

test("privacy notice states no cookies, no tracking, no upload (AC-21)", () => {
  const tree = render();
  const privacy = collect(tree, "section").find((s) => s.id === "datenschutz");
  const text = privacy.textContent.toLowerCase();
  assert.ok(text.includes("keine cookies"), "cookie statement missing");
  assert.ok(text.includes("kein tracking"), "tracking statement missing");
  assert.ok(
    text.includes("nicht an einen server"),
    "no-server-upload statement missing",
  );
});

test("footer source inserts values as text and uses no storage/cookie (AC-16/AC-18)", () => {
  const source = readFileSync(join(root, "js", "footer.js"), "utf8");
  assert.ok(!source.includes("innerHTML"), "footer must not use innerHTML");
  assert.ok(!source.includes("localStorage"), "footer must not use storage");
  assert.ok(!source.includes("sessionStorage"), "footer must not use storage");
  assert.ok(!source.includes("document.cookie"), "footer must not set cookies");
});
