import { createServer, loadEnv } from "vite";
import { renderToString } from "react-dom/server";
import React from "react";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const env = loadEnv("production", root, "");
const origin = (
  process.env.PUBLIC_SITE_URL ||
  env.PUBLIC_SITE_URL ||
  "https://nullvibe.tech"
).replace(/\/$/, "");
if (new URL(origin).protocol !== "https:")
  throw new Error("PUBLIC_SITE_URL must use HTTPS");
const vite = await createServer({
  configFile: path.join(root, "vite.config.mjs"),
  server: { middlewareMode: true },
  appType: "custom",
  mode: "production",
});
try {
  const { App } = await vite.ssrLoadModule("/src/App.jsx");
  const { routes, getPageMeta } = await vite.ssrLoadModule("/src/data.js");
  const template = await readFile("dist/client/index.html", "utf8");
  const escape = (s) =>
    s
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  for (const route of [...routes, "/404"]) {
    const meta = getPageMeta(route);
    let html = template;
    html = html.replace(
      /<title>.*?<\/title>/,
      `<title>${escape(meta.title)} | NullVibe</title>`,
    );
    html = html.replace(
      /(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/,
      `$1${escape(meta.description)}$2`,
    );
    html = html.replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*("\s*\/?>)/,
      `$1${escape(meta.title)} | NullVibe$2`,
    );
    html = html.replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*("\s*\/?>)/,
      `$1${escape(meta.description)}$2`,
    );
    const extra = meta.notFound
      ? '<meta name="robots" content="noindex,follow" />'
      : `<link rel="canonical" href="${origin}${route === "/" ? "/" : route}" /><meta property="og:url" content="${origin}${route}" />`;
    const social = `<meta property="og:image" content="${origin}/images/hero-logo.webp" /><meta name="twitter:card" content="summary_large_image" />`;
    const organization = JSON.stringify({"@context":"https://schema.org","@type":"Organization",name:"NullVibe",url:origin,email:"contact@nullvibe.tech",logo:`${origin}/images/logo-original.png`}).replaceAll('<','\\u003c');
    html = html.replace("</head>", `${extra}${social}<script type="application/ld+json">${organization}</script>\n</head>`);
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${renderToString(React.createElement(App, { path: route }))}</div>`,
    );
    const target =
      route === "/404"
        ? "dist/client/404.html"
        : path.join("dist/client", route === "/" ? "" : route, "index.html");
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html);
  }
  await writeFile(
    "dist/client/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${origin}${r}</loc></url>`).join("")}</urlset>`,
  );
  await writeFile(
    "dist/client/robots.txt",
    `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`,
  );
  console.log(
    `Prerendered ${routes.length} pages + 404 with unique metadata, sitemap and robots.txt.`,
  );
} finally {
  await vite.close();
}
