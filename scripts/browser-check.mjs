import { chromium, firefox, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const base = process.env.TEST_URL || "http://127.0.0.1:4175";
assert.ok(
  ["127.0.0.1", "localhost", "[::1]"].includes(new URL(base).hostname),
  "Run interactive checks against a local build.",
);
const engine = process.env.TEST_BROWSER || "chromium";
const launcher = { chromium, firefox, webkit }[engine];
assert.ok(launcher, "Choose chromium, firefox or webkit");
const output = "qa/final/" + engine;
const browser = await launcher.launch({
  headless: true,
  ...(engine === "chromium" && process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
});
mkdirSync(output, { recursive: true });
const results = [];
const errors = [];
const accessibility = [];
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
const page = await context.newPage();
page.setDefaultTimeout(9000);
page.on("pageerror", (e) => errors.push(e.message));
const sitemap = await (await page.request.get(base + "/sitemap.xml")).text();
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .concat("/missing");
assert.equal(routes.length, 23);
try {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      const response = await page.goto(base + route);
      await page.locator("h1").waitFor();
      await page.evaluate(() => document.fonts.ready);
      if (route === "/missing") assert.equal(response.status(), 404);
      else {
        // Some engines expose the CDN/server revalidation status for a rendered cached document.
        assert.ok([200, 304].includes(response.status()), route + " HTTP " + response.status());
        assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute("href")).pathname, route);
      }
      assert.equal(await page.locator("h1").count(), 1, route + " h1");
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        `${route} overflow at ${width}px`,
      );
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          Promise.all(imgs.map((i) => i.decode().catch(() => {}))),
        );
      assert.equal(
        await page
          .locator("img")
          .evaluateAll((imgs) => imgs.some((i) => i.naturalWidth === 0)),
        false,
        route + " broken image",
      );
      results.push(`${width}px ${route}: passed`);
    }
  }
  console.log(results.length + " route/viewport checks passed.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.locator("header summary.menu-toggle").click();
  assert.equal(await page.locator(".mobile-menu").getAttribute("open"), "");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".mobile-menu").getAttribute("open"), null);
  await page.locator("header summary.menu-toggle").click();
  await page
    .locator("#navigation")
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await page.waitForURL("**/services");
  await page
    .getByRole("link", { name: "Explore this service" })
    .first()
    .click();
  await page.waitForURL("**/services/web-applications");
  assert.match(
    await page.locator("h1").innerText(),
    /web application development/i,
  );
  await page.goto(base + "/faq");
  await page.locator(".faq-item summary").first().click();
  assert.equal(
    await page.locator(".faq-item").first().getAttribute("open"),
    "",
  );
  await page.locator(".faq-item summary").first().focus();
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator(".faq-item").first().getAttribute("open"),
    null,
  );
  await page.goto(base + "/demos");
  await page.getByRole("button", { name: "Commerce", exact: true }).click();
  assert.equal(await page.locator(".demo-card").count(), 1);
  await page.goto(base + "/demos/booking");
  assert.equal(
    await page
      .getByRole("button", { name: "Confirm demo appointment" })
      .isDisabled(),
    true,
  );
  await page.getByRole("button", { name: "Tuesday", exact: true }).click();
  await page.getByRole("button", { name: "10:30", exact: true }).click();
  await page.getByRole("button", { name: "Confirm demo appointment" }).click();
  assert.match(await page.getByRole("status").innerText(), /Tuesday at 10:30/);
  await page.goto(base + "/demos/commerce");
  await page
    .getByRole("button", { name: "Add Studio tote", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Add Everyday notebook", exact: true })
    .click();
  assert.match(await page.locator(".cart-total").innerText(), /66.00/);
  await page
    .getByRole("button", { name: "Remove Studio tote", exact: true })
    .click();
  assert.match(await page.locator(".cart-total").innerText(), /18.00/);
  await page.getByRole("button", { name: "Try demo checkout" }).click();
  assert.match(await page.getByRole("status").innerText(), /No payment/);
  await page.goto(base + "/demos/assistant");
  await page.getByRole("button", { name: "What does it cost?" }).click();
  assert.match(await page.getByRole("log").innerText(), /Pricing depends/);
  await page.getByLabel("Your message").fill("Can I speak to a human?");
  await page.getByRole("button", { name: "Send sample message" }).click();
  await page.waitForFunction(() => {
    const log = document.querySelector(".demo-chat");
    return (
      log.textContent.includes("No message has been sent") &&
      log.scrollHeight - log.clientHeight - log.scrollTop < 2
    );
  });
  async function fillContact() {
    await page.getByLabel("Your name").fill("Test Visitor");
    await page.getByLabel("Email address").fill("test@example.com");
    await page
      .getByLabel("Tell us about your project")
      .fill("We need a mobile booking application for our business.");
    await page.getByRole("checkbox").check();
  }
  // All submissions are intercepted before filling the form, including unexpected ones.
  let attempts = 0,
    mode = "error",
    health = false;
  await page.route("**/api/contact", async (r) => {
    attempts++;
    await r.fulfill({
      status: mode === "success" ? 200 : 502,
      json:
        mode === "success"
          ? { ok: true }
          : {
              ok: false,
              message: "Could not confirm delivery. Please try again.",
            },
    });
  });
  await page.route("**/api/health", (r) =>
    r.fulfill({ json: { contactConfigured: health } }),
  );
  await page.goto(base + "/contact?service=Mobile%20applications");
  await page.waitForFunction(
    () =>
      document.querySelector("select[name=service]").value ===
      "Mobile applications",
  );
  await fillContact();
  const draft = page.getByRole("link", { name: "Open email draft" });
  await draft.waitFor();
  assert.match(
    decodeURIComponent(await draft.getAttribute("href")),
    /mailto:contact@nullvibe.tech.*Mobile applications/s,
  );
  assert.equal(
    await page.getByRole("button", { name: "Send project enquiry" }).count(),
    0,
  );
  assert.equal(attempts, 0);
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save brief" }).click();
  const saved = await dl;
  assert.equal(saved.suggestedFilename(), "nullvibe-project-brief.txt");
  const brief = await (
    await import("node:fs/promises")
  ).readFile(await saved.path(), "utf8");
  assert.match(brief, /Mobile applications/);
  health = true;
  await page.goto(base + "/contact");
  const send = page.getByRole("button", { name: "Send project enquiry" });
  await send.waitFor();
  await send.click();
  assert.equal(attempts, 0);
  assert.equal(
    await page.locator("#name").evaluate((e) => e.validity.valueMissing),
    true,
  );
  await fillContact();
  await send.click();
  await page.getByRole("alert").waitFor();
  assert.match(await page.getByRole("alert").innerText(), /Could not confirm/);
  assert.equal(await page.getByLabel("Your name").inputValue(), "Test Visitor");
  mode = "success";
  await send.click();
  await page.getByRole("status").waitFor();
  assert.match(await page.getByRole("status").innerText(), /Thank you/);
  assert.equal(attempts, 2);
  await page.unroute("**/api/contact");
  await page.unroute("**/api/health");
  await page.goto(base + "/booking");
  assert.match(
    await page
      .getByRole("link", { name: "Request a call by email" })
      .getAttribute("href"),
    /^mailto:contact@nullvibe.tech/,
  );
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(base);
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "smooth",
  );
  assert.equal(
    await page
      .locator(".hero-copy")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  assert.equal(
    await page.locator(".cta").evaluate((e) => getComputedStyle(e).opacity),
    "1",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  results.push(
    "Menu/escape, service navigation, keyboard FAQ, demo filters, booking/cart/assistant, contact unavailable/download/preserved form/mocked acceptance/mocked failure, email booking, motion preferences: passed",
  );
  const noJS = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  await noJS.goto(base + "/services/web-applications");
  assert.match(
    await noJS.locator("h1").innerText(),
    /web application development/i,
  );
  assert.ok(
    (await noJS.locator("main").innerText()).includes(
      "A typical engagement includes",
    ),
  );
  await noJS.locator("header summary.menu-toggle").click();
  await noJS
    .locator("#navigation")
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await noJS.waitForURL("**/services");
  await noJS.close();
  results.push("Pre-rendered service content works without JavaScript: passed");
  for (const route of routes) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + route);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    accessibility.push({
      route,
      violations: scan.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
  }
  writeFileSync(
    output+"/accessibility.json",
    JSON.stringify(accessibility, null, 2),
  );
  for (const [name, width, height, route] of [
    ["home-desktop", 1440, 1000, "/"],
    ["home-mobile", 390, 844, "/"],
    ["process-desktop", 1440, 1000, "/process"],
    ["services-mobile", 390, 844, "/services"],
    ["contact-mobile", 390, 844, "/contact"],
    ["booking-mobile", 390, 844, "/booking"],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(base + route);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
  }
  assert.deepEqual(errors, [], "No hydration or runtime errors");
  const violations = accessibility.flatMap((s) =>
    s.violations.map((v) => ({ route: s.route, ...v })),
  );
  writeFileSync(
    output+"/results.json",
    JSON.stringify(
      { engine, version: browser.version(), results, errors, accessibilityViolations: violations.length },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify(
      {
        checks: results.length,
        errors,
        accessibilityViolations: violations.length,
      },
      null,
      2,
    ),
  );
  if (violations.length) {
    console.log(JSON.stringify(violations, null, 2));
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
