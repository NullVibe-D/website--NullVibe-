import { createServer as createHttpServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat, realpath } from "node:fs/promises";
import { resolve, dirname, extname, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";
import { isIP } from "node:net";
import {
  createContactApi,
  publicOrigin,
  readJson,
  RequestError,
} from "./contact-api.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".pdf": "application/pdf",
  ".webmanifest": "application/manifest+json",
  ".mp4": "video/mp4",
};
function setSecurityHeaders(response, secure) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  );
  if (secure)
    response.setHeader("Strict-Transport-Security", "max-age=31536000");
}

function json(response, status, payload, method = "GET") {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  response.end(method === "HEAD" ? undefined : body);
}

function clientAddress(request, trustProxy) {
  // Enable only behind one trusted proxy that replaces incoming forwarding headers.
  const forwarded = request.headers["x-forwarded-for"];
  if (trustProxy && typeof forwarded === "string" && isIP(forwarded.trim()))
    return forwarded.trim();
  return request.socket.remoteAddress || "unknown";
}

function acceptsGzip(header = "") {
  return header.split(",").some((part) => {
    const [encoding, ...parameters] = part.trim().split(";");
    const weight = parameters.find((value) => value.trim().startsWith("q="));
    return (
      encoding === "gzip" && (!weight || Number(weight.trim().slice(2)) > 0)
    );
  });
}

async function fileInside(root, candidate) {
  try {
    const resolved = await realpath(candidate);
    if (resolved !== root && !resolved.startsWith(root + sep)) return null;
    const info = await stat(resolved);
    return info.isFile() ? { path: resolved, info } : null;
  } catch (error) {
    if (["ENOENT", "ENOTDIR", "EACCES"].includes(error.code)) return null;
    throw error;
  }
}

async function serveStatic(request, response, pathname, rootPromise) {
  const root = await rootPromise;
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    throw new RequestError(400, "Invalid URL.");
  }
  const segments = decoded.split("/");
  if (
    /[\\\x00:]/.test(decoded) ||
    segments.some((segment) => segment.startsWith("."))
  )
    throw new RequestError(404, "Page not found.");
  const candidate = resolve(root, "." + decoded);
  let file = await fileInside(root, candidate);
  if (!file && !extname(decoded))
    file = await fileInside(root, resolve(candidate, "index.html"));
  let status = 200;
  if (!file) {
    status = 404;
    file = await fileInside(root, resolve(root, "404.html"));
  }
  if (!file) {
    const body =
      '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | NullVibe</title><h1>Page not found</h1><p><a href="/">Return to NullVibe</a></p></html>';
    response.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    });
    response.end(request.method === "HEAD" ? undefined : body);
    return;
  }
  const type =
    mimeTypes[extname(file.path).toLowerCase()] || "application/octet-stream";
  const html = type.startsWith("text/html");
  const immutable =
    status === 200 &&
    /^\/assets\/[^/]+-[A-Za-z0-9_-]{8,}\.[a-z0-9]+$/i.test(decoded);
  const etag = `W/"${file.info.size.toString(16)}-${Math.trunc(file.info.mtimeMs).toString(16)}"`;
  response.setHeader("Content-Type", type);
  response.setHeader(
    "Cache-Control",
    status !== 200 || html
      ? "no-cache"
      : immutable
        ? "public, max-age=31536000, immutable"
        : "public, max-age=3600",
  );
  response.setHeader("ETag", etag);
  response.setHeader("Last-Modified", file.info.mtime.toUTCString());
  response.setHeader("Vary", "Accept-Encoding");
  if (
    status === 200 &&
    request.headers["if-none-match"]
      ?.split(",")
      .map((value) => value.trim())
      .includes(etag)
  ) {
    response.writeHead(304);
    response.end();
    return;
  }
  const gzip =
    file.info.size > 1024 &&
    /^(text\/|application\/(?:json|xml|manifest\+json)|image\/svg\+xml)/.test(
      type,
    ) &&
    acceptsGzip(request.headers["accept-encoding"]);
  if (gzip) response.setHeader("Content-Encoding", "gzip");
  else response.setHeader("Content-Length", file.info.size);
  response.writeHead(status);
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  if (gzip) await pipeline(createReadStream(file.path), createGzip(), response);
  else await pipeline(createReadStream(file.path), response);
}

/** Dependencies are injectable so tests never send real email. No secrets enter the client bundle. */
export function createServer({
  rootDir = resolve(projectRoot, "dist/client"),
  env = process.env,
  ...apiOptions
} = {}) {
  const api = createContactApi({ env, ...apiOptions });
  const secure = publicOrigin(env.PUBLIC_SITE_URL)?.startsWith("https:");
  // Resolve once without an unhandled rejection if a build has not been created yet.
  const rootPromise = realpath(rootDir).catch(() => resolve(rootDir));
  const server = createHttpServer(async (request, response) => {
    setSecurityHeaders(response, secure);
    try {
      const pathname = new URL(request.url, "http://localhost").pathname;
      if (pathname.startsWith("/api/")) {
        const result = await api({
          pathname,
          method: request.method,
          headers: request.headers,
          address: clientAddress(request, env.TRUST_PROXY === "1"),
          readBody: (limit) => readJson(request, request.headers, limit),
        });
        request.resume();
        for (const [key, value] of Object.entries(result.headers))
          response.setHeader(key, value);
        json(response, result.status, result.payload, request.method);
        return;
      }
      if (!["GET", "HEAD"].includes(request.method)) {
        response.setHeader("Allow", "GET, HEAD");
        throw new RequestError(405, "Method not allowed.");
      }
      await serveStatic(request, response, pathname, rootPromise);
    } catch (error) {
      request.resume();
      if (response.headersSent) {
        if (!response.destroyed) response.destroy();
        return;
      }
      const status = error instanceof RequestError ? error.status : 500;
      json(
        response,
        status,
        {
          ok: false,
          message:
            error instanceof RequestError
              ? error.message
              : "Something went wrong. Please try again later.",
          ...(error.errors ? { errors: error.errors } : {}),
        },
        request.method,
      );
    }
  });
  server.headersTimeout = 15000;
  server.requestTimeout = 30000;
  server.keepAliveTimeout = 5000;
  return server;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const port = Number(process.env.PORT || 4175);
  const host = process.env.HOST || "127.0.0.1";
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("PORT must be an integer between 1 and 65535.");
  const server = createServer();
  server.listen(port, host, () =>
    console.log(`NullVibe is available at http://${host}:${port}`),
  );
  server.on("error", () => {
    console.error(
      "NullVibe server could not start. Check the host, port, and deployment configuration.",
    );
    process.exitCode = 1;
  });
  for (const signal of ["SIGTERM", "SIGINT"])
    process.once(signal, () => {
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10000).unref();
    });
}
