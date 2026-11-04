import { createServer, loadEnv } from "vite";
import { renderToString } from "react-dom/server";
import React from "react";
import { readFile, mkdir, writeFile, unlink } from "node:fs/promises";
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
  const { routes, getPageMeta, services, insightArticles } = await vite.ssrLoadModule("/src/data.js");
  const { faqItems } = await vite.ssrLoadModule("/src/CompanyPages.jsx");
  const template = await readFile("dist/client/index.html", "utf8");
  const manifest = JSON.parse(await readFile("dist/client/.vite/manifest.json", "utf8"));
  // Static pages use just the native navigation enhancements. Load form/demo
  // dependencies in parallel only on pages which actually need React.
  function interactiveScripts(route) {
    const key = route === "/contact" ? "contact" : /^\/demos(?:\/|$)/.test(route) ? "demos" : null;
    if (!key) return "";
    const entry = manifest["src/entries/" + key + ".jsx"];
    const imports = new Set();
    function collect(chunk) {
      for (const dep of chunk.imports || []) {
        if (imports.has(dep)) continue;
        imports.add(dep);
        collect(manifest[dep]);
      }
    }
    collect(entry);
    return [...imports].map(k => '<link rel="modulepreload" crossorigin href="/' + manifest[k].file + '" />').join("") +
      '<script type="module" crossorigin src="/' + entry.file + '"></script>';
  }
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
    const canonical = origin + (route === "/" ? "/" : route);
    const release = process.env.VERCEL_GIT_COMMIT_SHA || "";
    if (/^[0-9a-f]{40}$/i.test(release)) html = html.replace("</head>", '<meta name="build-revision" content="' + release + '" /></head>');
    const extra = meta.notFound
      ? '<meta name="robots" content="noindex,follow" />'
      : `<link rel="canonical" href="${canonical}" /><meta property="og:url" content="${canonical}" /><meta name="robots" content="index,follow,max-image-preview:large" />`;
    if (insightArticles.some(a => route === "/insights/" + a.slug)) html = html.replace(/(property="og:type"\s+content=")website(")/, "$1article$2");
    const social = meta.notFound ? "" : [
      '<meta property="og:site_name" content="NullVibe" />',
      '<meta property="og:locale" content="en_US" />',
      '<meta property="og:image" content="' + origin + '/images/hero-logo.webp" />',
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="942" />',
      '<meta property="og:image:alt" content="NullVibe chrome emblem with a crimson edge" />',
      '<meta name="twitter:card" content="summary_large_image" />',
      '<meta name="twitter:title" content="' + escape(meta.title + " | NullVibe") + '" />',
      '<meta name="twitter:description" content="' + escape(meta.description) + '" />',
      '<meta name="twitter:image" content="' + origin + '/images/hero-logo.webp" />',
      '<meta name="author" content="NullVibe" />'
    ].join("");
    const organizationId = origin + "/#organization";
    const graph = [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "NullVibe",
        description: "Custom software development studio building web applications, mobile apps, business websites and practical AI automation.",
        url: origin,
        email: "contact@nullvibe.tech",
        logo: { "@type": "ImageObject", url: origin + "/images/logo-original.png" },
        knowsAbout: [
          "Custom software development",
          "Web application development",
          "Mobile app development",
          "AI automation",
          "E-commerce development",
          "Business software integration"
        ],
        contactPoint: [{
          "@type": "ContactPoint",
          contactType: "sales",
          email: "contact@nullvibe.tech"
        }]
      },
      {
        "@type": "WebSite",
        "@id": origin + "/#website",
        name: "NullVibe",
        url: origin,
        publisher: { "@id": organizationId },
        inLanguage: "en"
      },
      {
        "@type": "WebPage",
        "@id": canonical + "#webpage",
        url: canonical,
        name: meta.title + " | NullVibe",
        description: meta.description,
        isPartOf: { "@id": origin + "/#website" },
        about: { "@id": organizationId },
        ...(route === "/" ? {primaryImageOfPage: {
          "@type": "ImageObject",
          url: origin + "/images/hero-logo.webp",
          width: 1200,
          height: 942
        }} : {}),
        inLanguage: "en"
      }
    ];
    if (route !== "/") {
      const parts = route.split("/").filter(Boolean);
      const items = [{
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: origin + "/"
      }];
      let current = "";
      for (const part of parts) {
        current += "/" + part;
        const service = services.find((item) => current === "/services/" + item.slug);
        const name = current === "/services" ? "Services"
          : current === "/demos" ? "Demos"
          : service ? service.title
          : getPageMeta(current).title;
        items.push({
          "@type": "ListItem",
          position: items.length + 1,
          name,
          item: origin + current
        });
      }
      graph.push({
        "@type": "BreadcrumbList",
        "@id": canonical + "#breadcrumb",
        itemListElement: items
      });
    }
    const service = services.find((item) => route === "/services/" + item.slug);
    if (service) {
      graph[2].mainEntity = { "@id": canonical + "#service" };
      graph.push({
        "@type": "Service",
        "@id": canonical + "#service",
        name: service.title,
        serviceType: service.title,
        description: meta.description,
        url: canonical,
        provider: { "@id": organizationId }
      });
    }
    const insight = insightArticles.find((item) => route === "/insights/" + item.slug);
    if (insight) {
      graph[2].mainEntity = { "@id": canonical + "#article" };
      graph.push({
        "@type": "Article",
        "@id": canonical + "#article",
        headline: insight.title,
        description: insight.description,
        datePublished: insight.published,
        dateModified: insight.published,
        author: { "@id": organizationId },
        publisher: { "@id": organizationId },
        mainEntityOfPage: { "@id": canonical + "#webpage" },
        image: [origin + "/images/hero-logo.webp"],
        articleSection: insight.category,
        keywords: insight.keywords,
        inLanguage: "en"
      });
    }
    if (route === "/faq") {
      graph.push({
        "@type": "FAQPage",
        "@id": canonical + "#faq",
        url: canonical,
        mainEntity: faqItems.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a }
        }))
      });
    }
    const structuredData = meta.notFound ? "" :
      '<script type="application/ld+json">' +
      JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
        .replace(/</g, "\\u003c") +
      "</script>";
    html = html.replace("</head>", extra + social + structuredData + interactiveScripts(route) + "\n</head>");
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
  await unlink("dist/client/.vite/manifest.json");
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
