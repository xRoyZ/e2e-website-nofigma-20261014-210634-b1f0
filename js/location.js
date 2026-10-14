// Location / directions section.
//
// Fills #location-content with the full address (composed from SITE.address),
// a short route description, a public-transport and a parking hint, and a map
// link that opens SITE.mapUrl in a new tab. Every value from data goes into
// the DOM as text (createElement + textContent), never via innerHTML.

import { SITE } from "./site-config.js";

function routeText() {
  return `Sie finden uns mitten in der Innenstadt, wenige Gehminuten von der Fußgängerzone entfernt. Folgen Sie der Beschilderung Richtung Zentrum und biegen Sie in die ${SITE.address.street} ein.`;
}

const TRANSIT_TEXT =
  "Mehrere Stadtbahn- und Buslinien halten in unmittelbarer Nähe. Die nächste Haltestelle liegt rund drei Gehminuten entfernt.";

const PARKING_TEXT =
  "Öffentliche Parkplätze gibt es in den umliegenden Seitenstraßen; ein Parkhaus befindet sich in Laufnähe.";

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text != null) {
    node.textContent = text;
  }
  return node;
}

function createHint(label, text) {
  const item = createElement("li", "location__hint");
  const labelEl = createElement("strong", "location__hint-label", label);
  item.append(labelEl, document.createTextNode(` ${text}`));
  return item;
}

export function initLocation(root) {
  if (!root) {
    return;
  }

  root.textContent = "";

  const card = createElement("div", "location card");

  const address = createElement("address", "location__address");
  address.append(
    createElement("p", "location__street", SITE.address.street),
    createElement(
      "p",
      "location__city",
      `${SITE.address.postalCode} ${SITE.address.city}`,
    ),
  );
  card.append(address);

  card.append(createElement("p", "location__route", routeText()));

  const hints = createElement("ul", "location__hints");
  hints.append(
    createHint("ÖPNV:", TRANSIT_TEXT),
    createHint("Parken:", PARKING_TEXT),
  );
  card.append(hints);

  const mapLink = createElement(
    "a",
    "button button--secondary location__map-link",
    "Karte öffnen",
  );
  mapLink.href = SITE.mapUrl;
  mapLink.target = "_blank";
  mapLink.rel = "noopener noreferrer";
  card.append(mapLink);

  root.append(card);
}
