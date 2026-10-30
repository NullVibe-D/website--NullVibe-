# NullVibe company website

A production-buildable, multi-page website for NullVibe. Public hosting has not been performed.

## Included

- 18 prerendered pages plus a proper 404: Home, Services, six service detail pages, Our process, Demos, three interactive demos, Company, FAQ, Contact, Discovery call, Privacy.
- White-first Manrope/charcoal/crimson design with the supplied logo and enhanced 3D hero.
- Responsive navigation, keyboard focus, skip link, reduced-motion support, native page transitions where supported and lightweight scroll reveals.
- Real Node contact endpoint with validation, abuse controls and Resend delivery integration.
- Direct contact@nullvibe.tech email and email-based call requests when a booking calendar is not configured.
- Page-specific titles, descriptions, canonical URLs, Open Graph information, organization metadata, sitemap and robots.txt.
- Self-hosted font, optimized WebP assets, compressed static responses and cache headers.

## Local development

Use Node.js22+.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 4174
```

The development server proxies /api to port4175. Start the production preview server to exercise the backend locally. After frontend edits, rebuild before reviewing the production preview.

## Production build and local preview

```sh
npm run build
npm run preview:production
```

Preview: http://127.0.0.1:4175. This loopback-only helper serves the real build and preserves local same-origin validation. `npm start` runs the production server with the canonical origin supplied by environment variables.

The build produces static HTML for each route in dist/client and keeps the original Sites packaging under dist/server and dist/.openai. Full contact delivery requires the Node server or equivalent API hosting; static-only hosting does not supply /api/contact.

## Configuration

See .env.example and docs/production.md. Public values already agreed: nullvibe.tech and contact@nullvibe.tech. Runtime credentials must be entered securely in deployment settings; do not paste keys into chat or commit them.

- PUBLIC_SITE_URL: canonical HTTPS origin used at build time and for the production origin check.
- VITE_CONTACT_EMAIL: public contact address.
- VITE_BOOKING_URL: optional real HTTPS scheduling URL; otherwise email call requests remain available.
- RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL: server-only delivery settings; sender domain must be verified.

The app never claims delivery succeeded without a provider acceptance. Failed/unconfigured delivery preserves the visitor's form, offers an email draft and permits downloading a brief. Demo bookings, orders and AI replies remain explicitly simulated.

## Verification

```sh
npm run test:server
npm run test:sites
npm run test:browser
npm run check:launch
```

Browser tests use this project's Playwright installation. Install Chromium with `npx playwright install chromium` or set PLAYWRIGHT_CHROMIUM_EXECUTABLE when using an existing browser. See qa/ and design-qa.md for the latest evidence. `check:launch` intentionally fails until required production email configuration is supplied; it never prints credential values.

## Hosting handoff

Do not publish this build until the owner requests hosting. The next stage is domain/DNS setup, HTTPS deployment, sender-domain verification, optional calendar connection, and a live delivery/booking check. See docs/production.md for exact operational details.

## Structure

src/components.jsx: shared navigation, footer, motion and controls.
src/MarketingPages.jsx: homepage and service pages.
src/CompanyPages.jsx: company, process, FAQ and privacy.
src/ContactPages.jsx: contact and booking.
src/Demos.jsx: interactive sample products.
src/data.js: service content, routes and metadata.
server/: production static serving and enquiry delivery.
scripts/prerender.mjs: static HTML and metadata generation.

Brand artwork: user-supplied NullVibe logo; enhanced hero generated from it using the built-in image tool. Fonts: Manrope. Icons: Phosphor. No stock client claims or testimonials.
