import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { request } from "node:http";
import { createServer } from "../server/index.mjs";

let workspace;
let rootDir;
let symlinkCreated = false;
const valid = {
  name: "Alex Example",
  email: "alex@example.com",
  company: "Example Company",
  service: "Web applications",
  budget: "Let us discuss",
  message: "We would like to build a customer booking platform.",
  website: "",
  consent: true,
};
const configured = {
  RESEND_API_KEY: "fake-provider-secret-never-send",
  CONTACT_TO_EMAIL: "contact@example.com",
  CONTACT_FROM_EMAIL: "website@example.com",
};

before(async () => {
  workspace = await mkdtemp(join(tmpdir(), "nullvibe-server-test-"));
  rootDir = join(workspace, "public");
  await Promise.all([
    mkdir(join(rootDir, "services"), { recursive: true }),
    mkdir(join(rootDir, "assets"), { recursive: true }),
    mkdir(join(workspace, "private")),
  ]);
  await Promise.all([
    writeFile(
      join(rootDir, "index.html"),
      "<!doctype html><title>NullVibe home</title><main>" +
        "Home content. ".repeat(150) +
        "</main>",
    ),
    writeFile(
      join(rootDir, "services", "index.html"),
      "<!doctype html><title>NullVibe services</title><main>Custom software</main>",
    ),
    writeFile(
      join(rootDir, "404.html"),
      "<!doctype html><title>Page not found</title><main>Missing page</main>",
    ),
    writeFile(
      join(rootDir, "assets", "app-12345678.js"),
      'console.log("application");',
    ),
    writeFile(join(rootDir, ".env"), "DO_NOT_SERVE_SECRET"),
    writeFile(join(workspace, "private", "secret.txt"), "DO_NOT_SERVE_SECRET"),
  ]);
  try {
    await symlink(
      join(workspace, "private"),
      join(rootDir, "outside"),
      process.platform === "win32" ? "junction" : "dir",
    );
    symlinkCreated = true;
  } catch {
    /* A restricted platform may not allow symlinks. Other traversal checks still run. */
  }
});

after(async () => {
  const temporaryRoot = resolve(tmpdir());
  const target = resolve(workspace);
  assert.ok(
    target.startsWith(temporaryRoot + sep) &&
      target.includes("nullvibe-server-test-"),
  );
  await rm(target, { recursive: true, force: true });
});

async function start(t, options = {}) {
  const server = createServer({
    rootDir,
    env: {},
    fetchImpl: async () => {
      throw new Error("Unexpected delivery attempt.");
    },
    ...options,
  });
  await new Promise((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolveClose) => server.close(resolveClose));
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  return {
    origin,
    server,
    get: (path = "/", options) => fetch(origin + path, options),
    post: (payload = valid, headers = {}) =>
      fetch(origin + "/api/contact", {
        method: "POST",
        headers: {
          Origin: origin,
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(payload),
      }),
  };
}

test("serves real deep-page HTML, HEAD and a proper 404 page", async (t) => {
  const app = await start(t);
  for (const path of ["/services", "/services/"]) {
    const response = await app.get(path);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /NullVibe services/);
    assert.equal(response.headers.get("cache-control"), "no-cache");
  }
  const head = await app.get("/services", { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  assert.ok(Number(head.headers.get("content-length")) > 0);
  for (const path of ["/missing-page", "/assets/missing.js"]) {
    const response = await app.get(path);
    assert.equal(response.status, 404);
    assert.match(await response.text(), /Page not found/);
  }
});

test("sets browser security headers and HTTPS-only HSTS", async (t) => {
  const local = await start(t);
  const response = await local.get();
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.match(
    response.headers.get("content-security-policy"),
    /script-src 'self'/,
  );
  assert.match(
    response.headers.get("content-security-policy"),
    /frame-ancestors 'none'/,
  );
  assert.equal(response.headers.get("strict-transport-security"), null);
  const deployed = await start(t, {
    env: { PUBLIC_SITE_URL: "https://nullvibe.example" },
  });
  const deployedResponse = await deployed.get();
  assert.equal(
    deployedResponse.headers.get("strict-transport-security"),
    "max-age=31536000",
  );
});

test("caches hashed assets, supports ETag revalidation and negotiates gzip", async (t) => {
  const app = await start(t);
  const asset = await app.get("/assets/app-12345678.js");
  assert.equal(
    asset.headers.get("cache-control"),
    "public, max-age=31536000, immutable",
  );
  const cached = await app.get("/assets/app-12345678.js", {
    headers: { "If-None-Match": asset.headers.get("etag") },
  });
  assert.equal(cached.status, 304);
  assert.equal(await cached.text(), "");
  const gzip = await app.get("/", { headers: { "Accept-Encoding": "gzip" } });
  assert.equal(gzip.headers.get("content-encoding"), "gzip");
  assert.match(await gzip.text(), /NullVibe home/);
  const identity = await app.get("/", {
    headers: { "Accept-Encoding": "gzip;q=0" },
  });
  assert.equal(identity.headers.get("content-encoding"), null);
});

test("does not serve dotfiles, encoded traversal or files outside the build directory", async (t) => {
  const app = await start(t);
  const paths = [
    "/.env",
    "/%2eenv",
    "/%2e%2e%2fprivate/secret.txt",
    "/%5c..%5cprivate%5csecret.txt",
  ];
  if (symlinkCreated) paths.push("/outside/secret.txt");
  for (const path of paths) {
    const response = await app.get(path);
    assert.equal(response.status, 404, path);
    assert.doesNotMatch(await response.text(), /DO_NOT_SERVE_SECRET/);
  }
});

test("health reveals only readiness state and never secret values", async (t) => {
  const empty = await start(t);
  assert.deepEqual(await (await empty.get("/api/health")).json(), {
    status: "ok",
    contactConfigured: false,
  });
  const ready = await start(t, { env: configured });
  const response = await ready.get("/api/health");
  assert.deepEqual(await response.json(), {
    status: "ok",
    contactConfigured: true,
  });
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("unconfigured delivery is an honest 503 without sending", async (t) => {
  let calls = 0;
  const app = await start(t, {
    fetchImpl: async () => {
      calls += 1;
    },
  });
  const response = await app.post();
  assert.equal(response.status, 503);
  const payload = await response.json();
  assert.equal(payload.ok, false);
  assert.match(payload.message, /has not been sent/);
  assert.equal(calls, 0);
});

test("valid enquiry sends plain text with Reply-To, then acknowledges provider acceptance", async (t) => {
  const deliveries = [];
  const app = await start(t, {
    env: configured,
    fetchImpl: async (url, options) => {
      deliveries.push({ url, options });
      return Response.json({ id: "mock-email-id" });
    },
  });
  const response = await app.post({
    ...valid,
    name: "  Alex Example  ",
    message: "<script>alert(1)</script> Please build our booking platform.",
  });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.ok, true);
  assert.match(payload.message, /accepted for delivery/);
  assert.equal(deliveries.length, 1);
  assert.equal(deliveries[0].url, "https://api.resend.com/emails");
  assert.equal(
    deliveries[0].options.headers.Authorization,
    `Bearer ${configured.RESEND_API_KEY}`,
  );
  const mail = JSON.parse(deliveries[0].options.body);
  assert.deepEqual(mail.to, [configured.CONTACT_TO_EMAIL]);
  assert.equal(mail.from, configured.CONTACT_FROM_EMAIL);
  assert.equal(mail.reply_to, valid.email);
  assert.equal(mail.html, undefined);
  assert.match(mail.text, /Name: Alex Example\n/);
  assert.match(mail.text, /<script>alert\(1\)<\/script>/);
  assert.doesNotMatch(
    JSON.stringify(payload),
    /mock-email-id|fake-provider-secret|website@example.com/,
  );
});

test("invalid field types, email, consent and control characters never reach delivery", async (t) => {
  let calls = 0;
  const app = await start(t, {
    env: configured,
    rateLimitMax: 20,
    fetchImpl: async () => {
      calls += 1;
      return Response.json({ id: "unwanted" });
    },
  });
  for (const [patch, field] of [
    [{ name: "A" }, "name"],
    [{ email: "not-an-email" }, "email"],
    [{ company: [] }, "company"],
    [{ service: "web\r\nInjected: value" }, "service"],
    [{ message: "short" }, "message"],
    [{ consent: "true" }, "consent"],
    [{ message: "x".repeat(5001) }, "message"],
  ]) {
    const response = await app.post({ ...valid, ...patch });
    assert.equal(response.status, 422, field);
    const result = await response.json();
    assert.equal(result.ok, false);
    assert.equal(typeof result.errors[field], "string");
  }
  assert.equal(calls, 0);
});

test("honeypot blocks delivery without fabricated success", async (t) => {
  let calls = 0;
  const app = await start(t, {
    env: configured,
    fetchImpl: async () => {
      calls += 1;
      return Response.json({ id: "unwanted" });
    },
  });
  const response = await app.post({
    ...valid,
    website: "https://spam.example",
  });
  assert.equal(response.status, 422);
  assert.equal((await response.json()).ok, false);
  assert.equal(calls, 0);
});

test("rejects malformed JSON, unsupported content types, and oversized declared bodies", async (t) => {
  const app = await start(t, { rateLimitMax: 20 });
  for (const [body, contentType, status] of [
    ["{broken", "application/json", 400],
    ["null", "application/json", 400],
    ["[]", "application/json", 400],
    ["name=Alex", "application/x-www-form-urlencoded", 415],
    [
      JSON.stringify({ ...valid, message: "x".repeat(22000) }),
      "application/json",
      413,
    ],
  ]) {
    const response = await app.get("/api/contact", {
      method: "POST",
      headers: { Origin: app.origin, "Content-Type": contentType },
      body,
    });
    assert.equal(response.status, status);
    assert.equal((await response.json()).ok, false);
  }
});

test("bounds chunked bodies without relying on Content-Length", async (t) => {
  const app = await start(t);
  const response = await new Promise((resolveResponse, reject) => {
    const req = request(
      app.origin + "/api/contact",
      {
        method: "POST",
        headers: {
          Origin: app.origin,
          "Content-Type": "application/json",
          "Transfer-Encoding": "chunked",
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () =>
          resolveResponse({
            status: res.statusCode,
            text: Buffer.concat(chunks).toString(),
          }),
        );
      },
    );
    req.on("error", reject);
    req.write('{"message":"');
    req.end("x".repeat(22000) + '"}');
  });
  assert.equal(response.status, 413);
  assert.equal(JSON.parse(response.text).ok, false);
});

test("an interrupted upload does not crash the server or trigger delivery", async (t) => {
  let calls = 0;
  const app = await start(t, {
    env: configured,
    fetchImpl: async () => {
      calls += 1;
      return Response.json({ id: "unwanted" });
    },
  });
  let incoming;
  const received = new Promise((resolveReceived) =>
    app.server.once("request", (req) => {
      incoming = req;
      req.once("data", resolveReceived);
    }),
  );
  const upload = request(app.origin + "/api/contact", {
    method: "POST",
    headers: {
      Origin: app.origin,
      "Content-Type": "application/json",
      "Content-Length": 1000,
    },
  });
  upload.on("error", () => {});
  upload.write('{"name":"Alex');
  await received;
  const closed = new Promise((resolveClosed) =>
    incoming.once("close", resolveClosed),
  );
  upload.destroy();
  await closed;
  assert.equal((await app.get("/api/health")).status, 200);
  assert.equal(calls, 0);
});

test("blocks cross-origin, absent-origin and noncanonical submissions", async (t) => {
  const local = await start(t, { rateLimitMax: 20 });
  for (const headers of [
    { Origin: "https://evil.example" },
    { Origin: "null" },
    { Origin: local.origin, "Sec-Fetch-Site": "cross-site" },
  ])
    assert.equal((await local.post(valid, headers)).status, 403);
  const missingOrigin = await local.get("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valid),
  });
  assert.equal(missingOrigin.status, 403);
  const live = await start(t, {
    env: { PUBLIC_SITE_URL: "https://nullvibe.example" },
  });
  assert.equal((await live.post()).status, 403);
  assert.equal(
    (await live.post(valid, { Origin: "https://nullvibe.example" })).status,
    503,
  );
});

test("limits attempts and permits a new request after the rate window expires", async (t) => {
  let time = 1000;
  const app = await start(t, {
    now: () => time,
    rateLimitMax: 2,
    rateLimitWindowMs: 60000,
  });
  assert.equal((await app.post()).status, 503);
  assert.equal((await app.post()).status, 503);
  const blocked = await app.post();
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get("retry-after"), "60");
  time += 60000;
  assert.equal((await app.post()).status, 503);
});

test("ignores spoofed forwarding headers unless a trusted single proxy is configured", async (t) => {
  const direct = await start(t, { rateLimitMax: 1 });
  assert.equal(
    (await direct.post(valid, { "X-Forwarded-For": "192.0.2.1" })).status,
    503,
  );
  assert.equal(
    (await direct.post(valid, { "X-Forwarded-For": "192.0.2.2" })).status,
    429,
  );
  const proxied = await start(t, {
    rateLimitMax: 1,
    env: { TRUST_PROXY: "1" },
  });
  assert.equal(
    (await proxied.post(valid, { "X-Forwarded-For": "192.0.2.1" })).status,
    503,
  );
  assert.equal(
    (await proxied.post(valid, { "X-Forwarded-For": "192.0.2.2" })).status,
    503,
  );
});

test("provider errors, missing receipts and timeout never disclose secrets or report success", async (t) => {
  for (const fetchImpl of [
    async () =>
      Response.json({ error: configured.RESEND_API_KEY }, { status: 401 }),
    async () => Response.json({}),
    async () => {
      throw new Error(configured.RESEND_API_KEY);
    },
    (_url, options) =>
      new Promise((_resolve, reject) =>
        options.signal.addEventListener(
          "abort",
          () => reject(options.signal.reason),
          { once: true },
        ),
      ),
  ]) {
    const app = await start(t, {
      env: configured,
      fetchImpl,
      deliveryTimeoutMs: 20,
    });
    const response = await app.post();
    assert.equal(response.status, 502);
    const text = await response.text();
    assert.equal(JSON.parse(text).ok, false);
    assert.doesNotMatch(
      text,
      /fake-provider-secret|website@example.com|contact@example.com/,
    );
  }
});

test("rejects wrong methods and unknown API routes with appropriate status and Allow", async (t) => {
  const app = await start(t);
  const contact = await app.get("/api/contact");
  assert.equal(contact.status, 405);
  assert.equal(contact.headers.get("allow"), "POST");
  const health = await app.get("/api/health", { method: "POST" });
  assert.equal(health.status, 405);
  assert.equal(health.headers.get("allow"), "GET, HEAD");
  assert.equal((await app.get("/api/missing")).status, 404);
  assert.equal((await app.get("/services", { method: "POST" })).status, 405);
});

test("refuses an insecure nonlocal canonical origin", () => {
  assert.throws(
    () => createServer({ env: { PUBLIC_SITE_URL: "http://nullvibe.example" } }),
    /HTTPS origin/,
  );
});
