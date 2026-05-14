import http from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(process.argv[2] || ".");
const port = Number(process.argv[3] || 4173);
const host = process.argv[4] || "127.0.0.1";

const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"]
]);

function send(response, status, body, type = "text/plain; charset=utf-8") {
  response.writeHead(status, { "content-type": type });
  response.end(body);
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const decoded = decodeURIComponent(url.pathname);
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  let filePath = resolve(join(root, normalize(relative)));

  if (!filePath.startsWith(root)) {
    send(response, 403, "Forbidden");
    return;
  }

  try {
    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      filePath = join(filePath, "index.html");
    }
    const type = types.get(extname(filePath)) || "application/octet-stream";
    response.writeHead(200, { "content-type": type });
    createReadStream(filePath).pipe(response);
  } catch {
    send(response, 404, "Not found");
  }
});

server.listen(port, host, () => {
  const script = fileURLToPath(import.meta.url);
  console.log(`Serving ${root} at http://${host}:${port}/ via ${script}`);
});
