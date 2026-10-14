// Tests for the contact form's client-side validation.
//
// Two layers are covered:
//  1. the pure validateContactForm helper (js/lib/validate.js), and
//  2. the untouched/no-error rule of initContact (js/contact.js), exercised
//     through a tiny in-process DOM stub -- no browser, no server.

import { test } from "node:test";
import assert from "node:assert/strict";
import { validateContactForm } from "../js/lib/validate.js";
import { initContact } from "../js/contact.js";

class FakeClassList {
  constructor() {
    this._set = new Set();
  }
  add(...names) {
    names.forEach((name) => this._set.add(name));
  }
  remove(...names) {
    names.forEach((name) => this._set.delete(name));
  }
  contains(name) {
    return this._set.has(name);
  }
}

class FakeElement {
  constructor(tag) {
    this.tagName = String(tag).toUpperCase();
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.classList = new FakeClassList();
    this._text = "";
    this.value = "";
    this.hidden = false;
    this.noValidate = false;
    this.className = "";
    this.id = "";
    this.focused = false;
  }
  set textContent(value) {
    this._text = String(value);
  }
  get textContent() {
    return this._text;
  }
  append(...nodes) {
    for (const node of nodes) {
      this.children.push(node);
    }
  }
  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }
  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name)
      ? this.attributes[name]
      : null;
  }
  removeAttribute(name) {
    delete this.attributes[name];
  }
  addEventListener(type, handler) {
    (this.listeners[type] ||= []).push(handler);
  }
  dispatchEvent(type) {
    const event = { preventDefault() {} };
    (this.listeners[type] || []).forEach((handler) => handler(event));
  }
  focus() {
    this.focused = true;
  }
}

function findById(node, id) {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findById(child, id);
    if (found) return found;
  }
  return null;
}

function mountContact() {
  globalThis.document = { createElement: (tag) => new FakeElement(tag) };
  const root = new FakeElement("div");
  initContact(root);
  return root;
}

test("validateContactForm accepts a complete, valid submission", () => {
  const result = validateContactForm({
    name: "Anna Beispiel",
    email: "anna@example.com",
    message: "Guten Tag, wann öffnen Sie morgen?",
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test("validateContactForm flags an invalid e-mail address", () => {
  const result = validateContactForm({
    name: "Anna Beispiel",
    email: "anna.example.com",
    message: "Guten Tag",
  });
  assert.equal(result.valid, false);
  assert.equal(typeof result.errors.email, "string");
  assert.ok(result.errors.email.length > 0);
  assert.equal(result.errors.name, undefined);
  assert.equal(result.errors.message, undefined);
});

test("validateContactForm flags every empty required field", () => {
  const result = validateContactForm({ name: "", email: "", message: "" });
  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
});

test("an untouched form starts neutral without error marking", () => {
  const root = mountContact();
  for (const key of ["name", "email", "message"]) {
    assert.equal(
      findById(root, `contact-${key}-error`).hidden,
      true,
      `${key} error must be hidden on an untouched form`,
    );
    assert.equal(
      findById(root, `contact-${key}`).getAttribute("aria-invalid"),
      null,
      `${key} must not be marked invalid before it was touched`,
    );
  }
  assert.equal(findById(root, "contact-status").hidden, true);
});

test("an error appears only after the field was left with an invalid value", () => {
  const root = mountContact();
  const email = findById(root, "contact-email");

  email.value = "keine-adresse";
  assert.equal(
    findById(root, "contact-email-error").hidden,
    true,
    "typing alone must not show an error",
  );

  email.dispatchEvent("blur");
  assert.equal(findById(root, "contact-email-error").hidden, false);
  assert.equal(email.getAttribute("aria-invalid"), "true");
  assert.equal(email.getAttribute("aria-describedby"), "contact-email-error");
});

test("a submit with errors moves focus to the first invalid field", () => {
  const root = mountContact();
  const form = root.children[0];

  form.dispatchEvent("submit");

  const name = findById(root, "contact-name");
  assert.equal(name.focused, true);
  assert.equal(name.getAttribute("aria-invalid"), "true");
});

test("a valid submit shows the confirmation and clears the fields", () => {
  const root = mountContact();
  const form = root.children[0];

  findById(root, "contact-name").value = "Anna";
  findById(root, "contact-email").value = "anna@example.com";
  findById(root, "contact-message").value = "Hallo";

  form.dispatchEvent("submit");

  assert.equal(findById(root, "contact-status").hidden, false);
  assert.equal(findById(root, "contact-name").value, "");
  assert.equal(findById(root, "contact-email").value, "");
  assert.equal(findById(root, "contact-message").value, "");
});
