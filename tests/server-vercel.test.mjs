import test from "node:test";
import assert from "node:assert/strict";
import { createVercelEndpoint } from "../server/vercel-adapter.mjs";
const base = "https://nullvibe.tech";
const input = {
  name: "QA Example",
  email: "visitor@example.com",
  message: "Example project with a clear requirement.",
  consent: true,
};
const configured = {
  CONTACT_TO_EMAIL: "team@example.com",
  CONTACT_FROM_EMAIL: "form@example.com",
  RESEND_API_KEY: "test-only",
};
function post(data, origin = base, ip = "192.0.2.1") {
  return new Request(base + "/api/contact", {
    method: "POST",
    headers: {
      origin,
      "Content-Type": "application/json",
      "x-vercel-forwarded-for": ip,
    },
    body: JSON.stringify(data),
  });
}
test("published function entry points respond as JSON, including HEAD and 405", async () => {
  const { default: health } = await import("../api/health.mjs");
  const { default: contact } = await import("../api/contact.mjs");
  const r = await health.fetch(new Request(base + "/api/health"));
  assert.equal(r.status, 200);
  assert.equal(typeof (await r.json()).contactConfigured, "boolean");
  assert.equal(r.headers.get("cache-control"), "no-store");
  assert.equal(
    await (
      await health.fetch(new Request(base + "/api/health", { method: "HEAD" }))
    ).text(),
    "",
  );
  const method = await contact.fetch(new Request(base + "/api/contact"));
  assert.equal(method.status, 405);
  assert.equal(method.headers.get("allow"), "POST");
});
test("Vercel reads real request streams and rate limits each trusted address separately", async () => {
  let sent = 0;
  const endpoint = createVercelEndpoint("/api/contact", {
    env: configured,
    rateLimitMax: 1,
    fetchImpl: async (url, init) => {
      sent++;
      assert.equal(url, "https://api.resend.com/emails");
      assert.equal(JSON.parse(init.body).reply_to, input.email);
      return Response.json({ id: "mock-receipt" });
    },
  });
  assert.equal(
    (await endpoint.fetch(post(input, "https://elsewhere.example"))).status,
    403,
  );
  assert.equal((await endpoint.fetch(post(input))).status, 200);
  assert.equal((await endpoint.fetch(post(input))).status, 429);
  assert.equal((await endpoint.fetch(post({}, base, "192.0.2.2"))).status, 422);
  assert.equal(sent, 1);
});
test("provider failure, unconfigured mail and preview never claim delivery", async () => {
  const fail = createVercelEndpoint("/api/contact", {
    env: configured,
    fetchImpl: async () => Response.json({}, { status: 401 }),
  });
  assert.equal((await fail.fetch(post(input))).status, 502);
  const off = createVercelEndpoint("/api/contact", { env: {} });
  assert.equal((await off.fetch(post(input))).status, 503);
  const preview = "https://qa.example";
  const p = createVercelEndpoint("/api/contact", {
    env: { ...configured, VERCEL_ENV: "preview", VERCEL_URL: "qa.example" },
    fetchImpl: () => assert.fail("Preview must not send mail"),
  });
  assert.equal((await p.fetch(post(input, preview))).status, 503);
  const large = await off.fetch(post({ ...input, message: "x".repeat(22000) }));
  assert.equal(large.status, 413);
});
