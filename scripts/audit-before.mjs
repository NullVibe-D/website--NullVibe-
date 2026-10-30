import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_URL || 'http://127.0.0.1:4174';
const out = 'qa/before';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}) });
const results = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
    for (const route of ['/', '/services', '/contact', '/booking']) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${out}/${route.slice(1) || 'home'}-${width}.png`, fullPage: true });
      results.push(await page.evaluate(({ route, width, status }) => ({
        route, width, status, title: document.title,
        h1: [...document.querySelectorAll('h1')].map(el => el.innerText),
        headings: [...document.querySelectorAll('h2')].map(el => el.innerText),
        nav: [...document.querySelectorAll('header nav a')].map(el => ({ text: el.textContent, to: el.getAttribute('href') })),
        buttons: [...document.querySelectorAll('button, .button')].map(el => ({ text: el.textContent, disabled: el.disabled || false })),
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        pageHeight: document.documentElement.scrollHeight,
        resources: performance.getEntriesByType('resource').map(r => ({ name: r.name.split('/').pop(), transfer: r.transferSize, duration: Math.round(r.duration) })),
      }), { route, width, status: response.status() }));
    }
    await page.close();
  }
  await writeFile(`${out}/audit.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.map(({ resources, ...r }) => r), null, 2));
} finally { await browser.close(); }
