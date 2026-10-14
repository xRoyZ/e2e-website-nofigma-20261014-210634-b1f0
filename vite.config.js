// Vite build configuration.
//
// The menu is fetched at runtime by its literal path "data/menu.json"
// (see js/menu.js). Vite bundles only imported modules, so a runtime-fetched
// JSON file is otherwise absent from the build output: the request falls
// through to the static server's SPA fallback and receives index.html instead
// of JSON. This config emits the data file into the build at exactly the path
// the page fetches, so the menu loads from the built site too.
//
// In development the file is served straight from the repository root, so this
// plugin only has an effect for `vite build`.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const MENU_DATA_PATH = fileURLToPath(new URL("./data/menu.json", import.meta.url));

export default {
  plugins: [
    {
      name: "emit-menu-data",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "data/menu.json",
          source: readFileSync(MENU_DATA_PATH, "utf8"),
        });
      },
    },
  ],
};
