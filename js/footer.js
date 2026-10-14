// Footer section.
//
// Renders the café's contact details (address, phone, example contact
// address), links to the Impressum and the privacy notice, and the two legal
// blocks themselves. Every value comes from the shared SITE config and is
// inserted as text (textContent) — no HTML injection, no external script, no
// cookie, no storage.

import { SITE } from "./site-config.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined && text !== null) {
    node.textContent = text;
  }
  return node;
}

function addressLine() {
  const p = el("p", "footer__line");
  p.append(
    el("span", "footer__street", SITE.address.street),
    el("span", "footer__city", `${SITE.address.postalCode} ${SITE.address.city}`),
  );
  return p;
}

function contactLink(href, label) {
  const a = el("a", "footer__link", label);
  a.href = href;
  return a;
}

export function initFooter(root) {
  if (!root) {
    return;
  }
  root.textContent = "";

  const columns = el("div", "footer__columns");

  const contactCol = el("div", "footer__col");
  contactCol.append(el("p", "footer__brand", SITE.name));
  contactCol.append(addressLine());

  const phoneLine = el("p", "footer__line");
  phoneLine.append(
    contactLink(`tel:${SITE.phone.replace(/\s+/g, "")}`, SITE.phone),
  );
  contactCol.append(phoneLine);

  const emailLine = el("p", "footer__line");
  emailLine.append(contactLink(`mailto:${SITE.email}`, SITE.email));
  contactCol.append(emailLine);

  const legalCol = el("div", "footer__col");
  const legalNav = el("nav", "footer__nav");
  legalNav.setAttribute("aria-label", "Rechtliche Hinweise");
  const legalList = el("ul", "footer__links");
  for (const [target, label] of [
    ["#impressum", "Impressum"],
    ["#datenschutz", "Datenschutz"],
  ]) {
    const li = document.createElement("li");
    const a = el("a", "footer__link", label);
    a.href = target;
    li.append(a);
    legalList.append(li);
  }
  legalNav.append(legalList);
  legalCol.append(legalNav);

  columns.append(contactCol, legalCol);
  root.append(columns);

  const impressum = el("section", "footer__legal");
  impressum.id = "impressum";
  impressum.append(el("h2", "footer__legal-heading", "Impressum"));
  impressum.append(el("p", "footer__paragraph", `Betreiber: ${SITE.name}`));
  impressum.append(
    el(
      "p",
      "footer__paragraph",
      `Anschrift: ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}`,
    ),
  );
  impressum.append(
    el(
      "p",
      "footer__paragraph",
      `Kontakt: Telefon ${SITE.phone}, E-Mail ${SITE.email}`,
    ),
  );
  root.append(impressum);

  const datenschutz = el("section", "footer__legal");
  datenschutz.id = "datenschutz";
  datenschutz.append(el("h2", "footer__legal-heading", "Datenschutz"));
  datenschutz.append(
    el(
      "p",
      "footer__paragraph",
      "Diese Website setzt keine Cookies und verwendet kein Tracking. " +
        "Formulareingaben werden nicht an einen Server übertragen und " +
        "verlassen den Browser nicht.",
    ),
  );
  root.append(datenschutz);
}
