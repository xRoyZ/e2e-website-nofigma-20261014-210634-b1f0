// Minimal static file server for the café website.
//
// RUN.json declares this as the start command of the `web` service: the site is
// still a pure static page (no build step, no dependencies), but the run
// contract needs a process that binds a port and answers a health probe. This
// server serves the repository root over HTTP and nothing else.

import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";

const ROOT = resolve(process.cwd());

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function portFromArgs(argv) {
  const flag = argv.indexOf("--port");
  if (flag !== -1 && argv[flag + 1]) {
    return Number.parseInt(argv[flag + 1], 10);
  }
  return Number.parseInt(process.env.PORT || "8000", 10);
}

function resolveRequestPath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null;
  }
  const relative = normalize(decoded).replace(/^([/\\])+/, "");
  const target = resolve(join(ROOT, relative));
  if (target !== ROOT && !target.startsWith(ROOT + sep)) {
    return null;
  }
  return target;
}

async function findFile(target) {
  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      return findFile(join(target, "index.html"));
    }
    if (info.isFile()) {
      return { path: target, size: info.size };
    }
  } catch {
    return null;
  }
  return null;
}

const server = createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8", Allow: "GET, HEAD" });
    res.end("Method Not Allowed");
    return;
  }

  const target = resolveRequestPath(req.url || "/");
  const file = target ? await findFile(target) : null;
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  const headers = {
    "Content-Type": CONTENT_TYPES[extname(file.path).toLowerCase()] || "application/octet-stream",
    "Content-Length": String(file.size),
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  const stream = createReadStream(file.path);
  stream.on("error", () => {
    res.destroy();
  });
  stream.pipe(res);
});

const port = portFromArgs(process.argv.slice(2));
const host = process.env.HOST || "0.0.0.0";
server.listen(port, host, () => {
  console.log(`Café website served from ${ROOT} on http://${host}:${port}/`);
});
