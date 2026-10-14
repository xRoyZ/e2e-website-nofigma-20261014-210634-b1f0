// Contact form section with fully client-side validation.
//
// The form never sends anything: it has no action, no method and performs no
// fetch/XHR. Validation runs in the browser through the pure helper in
// js/lib/validate.js. The entered values are never written to localStorage or
// sessionStorage -- they live only in the input elements until a successful
// submit clears them.

import { validateContactForm } from "./lib/validate.js";

const SUCCESS_MESSAGE =
  "Vielen Dank! Ihre Angaben sind vollständig und wurden geprüft.";

const WARNING_GLYPH = "\u26A0"; // ⚠ short inline warning glyph (DESIGN.md)

const FIELD_SPECS = [
  {
    key: "name",
    label: "Name",
    control: "input",
    type: "text",
    autocomplete: "name",
  },
  {
    key: "email",
    label: "E-Mail",
    control: "input",
    type: "email",
    autocomplete: "email",
  },
  { key: "message", label: "Nachricht", control: "textarea" },
];

export function initContact(root) {
  if (!root) return;

  root.textContent = "";

  const form = document.createElement("form");
  form.className = "contact-form card";
  form.noValidate = true;
  form.setAttribute("novalidate", "");

  const fields = {};

  for (const spec of FIELD_SPECS) {
    const field = document.createElement("div");
    field.className = "contact-form__field";

    const label = document.createElement("label");
    label.className = "contact-form__label";
    label.setAttribute("for", `contact-${spec.key}`);
    label.textContent = spec.label;

    let input;
    if (spec.control === "textarea") {
      input = document.createElement("textarea");
      input.rows = 5;
      input.className = "contact-form__input contact-form__textarea";
    } else {
      input = document.createElement("input");
      input.type = spec.type;
      input.className = "contact-form__input";
    }
    input.id = `contact-${spec.key}`;
    input.name = spec.key;
    if (spec.autocomplete) {
      input.setAttribute("autocomplete", spec.autocomplete);
    }

    const error = document.createElement("p");
    error.className = "contact-form__error";
    error.id = `contact-${spec.key}-error`;
    error.hidden = true;

    field.append(label, input, error);
    form.append(field);

    fields[spec.key] = { input, error, field, touched: false };
  }

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "button button--primary contact-form__submit";
  submit.textContent = "Absenden";
  form.append(submit);

  const status = document.createElement("p");
  status.className = "contact-form__success";
  status.id = "contact-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.hidden = true;
  form.append(status);

  let submitAttempted = false;

  function collect() {
    const values = {};
    for (const spec of FIELD_SPECS) {
      values[spec.key] = fields[spec.key].input.value;
    }
    return values;
  }

  function setFieldError(key, message) {
    const ref = fields[key];
    if (message) {
      ref.error.textContent = `${WARNING_GLYPH} ${message}`;
      ref.error.hidden = false;
      ref.field.classList.add("contact-form__field--invalid");
      ref.input.setAttribute("aria-invalid", "true");
      ref.input.setAttribute("aria-describedby", ref.error.id);
    } else {
      ref.error.textContent = "";
      ref.error.hidden = true;
      ref.field.classList.remove("contact-form__field--invalid");
      ref.input.removeAttribute("aria-invalid");
      ref.input.removeAttribute("aria-describedby");
    }
  }

  function validateAll() {
    const result = validateContactForm(collect());
    for (const spec of FIELD_SPECS) {
      setFieldError(spec.key, result.errors[spec.key] || "");
    }
    return result;
  }

  function clearStatus() {
    if (status.hidden === false) {
      status.hidden = true;
      status.textContent = "";
    }
  }

  for (const spec of FIELD_SPECS) {
    const ref = fields[spec.key];

    ref.input.addEventListener("blur", () => {
      ref.touched = true;
      const result = validateContactForm(collect());
      setFieldError(spec.key, result.errors[spec.key] || "");
    });

    ref.input.addEventListener("input", () => {
      clearStatus();
      if (ref.touched || submitAttempted) {
        const result = validateContactForm(collect());
        setFieldError(spec.key, result.errors[spec.key] || "");
      }
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAttempted = true;

    const result = validateAll();

    if (!result.valid) {
      const firstInvalid = FIELD_SPECS.find((spec) => result.errors[spec.key]);
      if (firstInvalid) {
        fields[firstInvalid.key].input.focus();
      }
      return;
    }

    for (const spec of FIELD_SPECS) {
      const ref = fields[spec.key];
      ref.input.value = "";
      ref.touched = false;
      setFieldError(spec.key, "");
    }
    submitAttempted = false;

    status.textContent = SUCCESS_MESSAGE;
    status.hidden = false;
  });

  root.append(form);
}
