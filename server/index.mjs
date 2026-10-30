import { createServer as createHttpServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat, realpath } from "node:fs/promises";
import { resolve, dirname, extname, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";
import { isIP } from "node:net";

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
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const localhostNames = new Set(["localhost", "127.0.0.1", "[::1]"]);

class RequestError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

function publicOrigin(value) {
  if (!value) return null;
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    (url.protocol === "http:" && !localhostNames.has(url.hostname))
  ) {
    throw new Error(
      "PUBLIC_SITE_URL must be an HTTPS origin, or HTTP localhost for development.",
    );
  }
  return url.origin;
}

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

function validateContact(input) {
  if (!input || Array.isArray(input) || typeof input !== "object")
    throw new RequestError(400, "Please submit a valid project enquiry.");
  const errors = {};
  const values = {};
  for (const [field, min, max] of [
    ["name", 2, 100],
    ["email", 3, 254],
    ["company", 0, 150],
    ["service", 0, 100],
    ["budget", 0, 100],
    ["message", 15, 5000],
  ]) {
    const raw = input[field] ?? "";
    const value = typeof raw === "string" ? raw.trim() : "";
    values[field] = value;
    if (
      typeof raw !== "string" ||
      value.length < min ||
      value.length > max ||
      (field !== "message" && /[\x00-\x1f\x7f]/.test(value))
    ) {
      errors[field] = min
        ? `Use ${min}–${max} characters for ${field}.`
        : `Use no more than ${max} characters for ${field}.`;
    }
  }
  if (!emailPattern.test(values.email))
    errors.email = "Enter a valid email address.";
  if (input.consent !== true)
    errors.consent = "Please agree that we may contact you about this enquiry.";
  if (Object.keys(errors).length)
    throw new RequestError(
      422,
      "Please check the highlighted details.",
      errors,
    );
  if (
    input.website != null &&
    (typeof input.website !== "string" || input.website.trim())
  )
    throw new RequestError(
      422,
      "This enquiry could not be submitted. Please try again.",
    );
  return values;
}

function readJson(request, limit) {
  if (
    !/^application\/json(?:\s*;|$)/i.test(request.headers["content-type"] || "")
  )
    throw new RequestError(415, "Use JSON to submit your enquiry.");
  if (
    request.headers["content-encoding"] &&
    request.headers["content-encoding"] !== "identity"
  )
    throw new RequestError(415, "Compressed request bodies are not supported.");
  if (Number(request.headers["content-length"]) > limit)
    throw new RequestError(
      413,
      "Your enquiry is too large. Please shorten it and try again.",
    );
  return new Promise((resolveBody, reject) => {
    let size = 0;
    const chunks = [];
    function cleanup() {
      request.off("data", data);
      request.off("end", end);
      request.off("aborted", aborted);
      request.off("error", failed);
    }
    function failed(error) {
      cleanup();
      reject(error);
    }
    function aborted() {
      failed(
        new RequestError(400, "The enquiry was interrupted. Please try again."),
      );
    }
    function data(chunk) {
      size += chunk.length;
      if (size > limit) {
        failed(
          new RequestError(
            413,
            "Your enquiry is too large. Please shorten it and try again.",
          ),
        );
        request.resume();
      } else chunks.push(chunk);
    }
    function end() {
      cleanup();
      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new RequestError(400, "Please submit valid JSON."));
      }
    }
    request.on("data", data);
    request.once("end", end);
    request.once("aborted", aborted);
    request.once("error", failed);
  });
}

function originAllowed(request, configuredOrigin) {
  try {
    const origin = new URL(request.headers.origin);
    if (origin.origin !== request.headers.origin) return false;
    if (request.headers["sec-fetch-site"] === "cross-site") return false;
    if (configuredOrigin) return origin.origin === configuredOrigin;
    return (
      localhostNames.has(origin.hostname) &&
      origin.protocol === "http:" &&
      origin.host === request.headers.host
    );
  } catch {
    return false;
  }
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
  fetchImpl = globalThis.fetch,
  now = Date.now,
  rateLimitMax = 5,
  rateLimitWindowMs = 15 * 60 * 1000,
  maxBodyBytes = 20 * 1024,
  deliveryTimeoutMs = 10000,
} = {}) {
  const configuredOrigin = publicOrigin(env.PUBLIC_SITE_URL);
  const secure = configuredOrigin?.startsWith("https:");
  const contactConfigured = Boolean(
    env.RESEND_API_KEY?.trim() &&
    emailPattern.test(env.CONTACT_TO_EMAIL || "") &&
    emailPattern.test(env.CONTACT_FROM_EMAIL || ""),
  );
  // Resolve once without an unhandled rejection if a build has not been created yet.
  const rootPromise = realpath(rootDir).catch(() => resolve(rootDir));
  const attempts = new Map();
  const server = createHttpServer(async (request, response) => {
    setSecurityHeaders(response, secure);
    try {
      const pathname = new URL(request.url, "http://localhost").pathname;
      if (pathname === "/api/health") {
        if (!["GET", "HEAD"].includes(request.method)) {
          response.setHeader("Allow", "GET, HEAD");
          throw new RequestError(405, "Method not allowed.");
        }
        json(
          response,
          200,
          { status: "ok", contactConfigured },
          request.method,
        );
        return;
      }
      if (pathname === "/api/contact") {
        if (request.method !== "POST") {
          response.setHeader("Allow", "POST");
          throw new RequestError(405, "Method not allowed.");
        }
        if (!originAllowed(request, configuredOrigin))
          throw new RequestError(
            403,
            "Please submit your enquiry from the NullVibe website.",
          );
        const time = now();
        for (const [address, entry] of attempts)
          if (entry.resetAt <= time) attempts.delete(address);
        const address = clientAddress(request, env.TRUST_PROXY === "1");
        const entry = attempts.get(address) || {
          count: 0,
          resetAt: time + rateLimitWindowMs,
        };
        if (
          entry.count >= rateLimitMax ||
          (!attempts.has(address) && attempts.size >= 10000)
        ) {
          response.setHeader(
            "Retry-After",
            String(Math.max(1, Math.ceil((entry.resetAt - time) / 1000))),
          );
          throw new RequestError(
            429,
            "You have sent several enquiries recently. Please wait a little before trying again.",
          );
        }
        entry.count += 1;
        attempts.set(address, entry);
        const values = validateContact(await readJson(request, maxBodyBytes));
        if (!contactConfigured)
          throw new RequestError(
            503,
            "Online enquiry delivery is not connected yet. Your message has not been sent. Please use the contact alternatives on this page.",
          );
        const text = [
          "New NullVibe project enquiry",
          "",
          `Name: ${values.name}`,
          `Email: ${values.email}`,
          `Company: ${values.company || "Not specified"}`,
          `Service: ${values.service || "Not specified"}`,
          `Budget: ${values.budget || "Not specified"}`,
          "",
          "Project:",
          values.message,
          "",
          "Permission: The sender agreed to be contacted about this enquiry.",
        ].join("\n");
        try {
          const delivered = await fetchImpl("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: env.CONTACT_FROM_EMAIL,
              to: [env.CONTACT_TO_EMAIL],
              reply_to: values.email,
              subject: "New project enquiry | NullVibe",
              text,
            }),
            signal: AbortSignal.timeout(deliveryTimeoutMs),
          });
          if (!delivered.ok) {
            await delivered.body?.cancel();
            throw new Error("Email provider declined the message.");
          }
          const receipt = await delivered.json();
          if (typeof receipt.id !== "string" || !receipt.id)
            throw new Error("Email provider returned no delivery receipt.");
        } catch {
          throw new RequestError(
            502,
            "We could not confirm delivery right now. Your details are still available on this page; please try again later or use an alternative contact option.",
          );
        }
        json(response, 200, {
          ok: true,
          message:
            "Your enquiry has been accepted for delivery. Thank you for sharing your project.",
        });
        return;
      }
      if (pathname.startsWith("/api/"))
        throw new RequestError(404, "Endpoint not found.");
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
