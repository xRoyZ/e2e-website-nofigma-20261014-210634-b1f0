// Menu section.
//
// Loads data/menu.json, groups its dishes by category and renders one block
// per category into the given root element. Every value taken from the file is
// written into the DOM as text only (createElement + textContent), never via
// innerHTML — including the error state shown when the file cannot be loaded.

const MENU_URL = "data/menu.json";

const NON_BREAKING_SPACE = "\u00a0";

// Formats a price as a German Euro amount: comma as decimal separator, always
// two decimals, a non-breaking space before the € sign ('8,50 €').
export function formatPrice(price) {
  return `${price.toFixed(2).replace(".", ",")}${NON_BREAKING_SPACE}€`;
}

// Pure grouping helper: keeps the categories in the order they appear in the
// file and attaches the formatted price to every dish. Importable from Node.
export function groupByCategory(categories) {
  if (!Array.isArray(categories)) {
    return [];
  }
  return categories.map((category) => {
    const items = Array.isArray(category.items) ? category.items : [];
    return {
      name: category.name,
      items: items.map((item) => ({
        name: item.name,
        description: item.description,
        price: item.price,
        formattedPrice:
          typeof item.price === "number" && Number.isFinite(item.price)
            ? formatPrice(item.price)
            : "",
      })),
    };
  });
}

// Whether a parsed payload has the shape {"categories":[{name, items:[...]}]}.
function isMenuPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }
  const categories = payload.categories;
  if (!Array.isArray(categories) || categories.length === 0) {
    return false;
  }
  return categories.every(
    (category) =>
      category &&
      typeof category === "object" &&
      typeof category.name === "string" &&
      Array.isArray(category.items) &&
      category.items.every(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.name === "string" &&
          typeof item.description === "string" &&
          typeof item.price === "number" &&
          Number.isFinite(item.price),
      ),
  );
}

function renderMenu(root, categories) {
  const grid = document.createElement("div");
  grid.className = "menu-grid";

  for (const group of groupByCategory(categories)) {
    const section = document.createElement("section");
    section.className = "menu-category";

    const heading = document.createElement("h3");
    heading.className = "menu-category__heading";
    heading.textContent = group.name;
    section.appendChild(heading);

    const list = document.createElement("ul");
    list.className = "menu-category__items";

    for (const item of group.items) {
      const row = document.createElement("li");
      row.className = "menu-item";

      const main = document.createElement("div");
      main.className = "menu-item__main";

      const name = document.createElement("p");
      name.className = "menu-item__name";
      name.textContent = item.name;

      const description = document.createElement("p");
      description.className = "menu-item__description";
      description.textContent = item.description;

      main.append(name, description);

      const price = document.createElement("p");
      price.className = "menu-item__price";
      price.textContent = item.formattedPrice;

      row.append(main, price);
      list.appendChild(row);
    }

    section.appendChild(list);
    grid.appendChild(section);
  }

  root.replaceChildren(grid);
}

function renderError(root) {
  const box = document.createElement("div");
  box.className = "menu-error";
  box.setAttribute("role", "alert");

  const heading = document.createElement("p");
  heading.className = "menu-error__heading";
  heading.textContent = "Speisekarte derzeit nicht verfügbar";

  const body = document.createElement("p");
  body.className = "menu-error__body";
  body.textContent =
    "Die Speisekarte konnte nicht geladen werden. Bitte laden Sie die Seite neu.";

  box.append(heading, body);
  root.replaceChildren(box);
}

export async function initMenu(root) {
  if (!root) {
    return;
  }
  try {
    const response = await fetch(MENU_URL);
    if (!response.ok) {
      throw new Error(`Menu request failed with status ${response.status}`);
    }
    const payload = await response.json();
    if (!isMenuPayload(payload)) {
      throw new Error("Menu payload has an unexpected shape");
    }
    renderMenu(root, payload.categories);
  } catch (error) {
    console.error("Failed to load the menu:", error);
    renderError(root);
  }
}
