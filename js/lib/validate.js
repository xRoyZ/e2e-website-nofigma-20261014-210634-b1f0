// Pure, Node-importable validation for the contact form.
//
// validateContactForm is deliberately free of DOM access so the exact same
// function runs in the browser (js/contact.js) and under `node --test`.
//
// E-mail pattern (documented once, here): exactly one '@' separates a
// non-empty local part from a non-empty domain, the domain contains at least
// one dot and neither side contains whitespace. This pragmatic, HTML-spec
// compatible check catches the common typos (missing '@', missing domain or
// TLD) without re-implementing the full RFC 5321 grammar.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value) {
  return typeof value === "string" ? value : "";
}

export function validateContactForm(values) {
  const name = asString(values && values.name);
  const email = asString(values && values.email);
  const message = asString(values && values.message);

  const errors = {};

  if (name.trim() === "") {
    errors.name = "Bitte geben Sie Ihren Namen ein.";
  }

  if (email.trim() === "") {
    errors.email = "Bitte geben Sie Ihre E-Mail-Adresse ein.";
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  }

  if (message.trim() === "") {
    errors.message = "Bitte geben Sie eine Nachricht ein.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
