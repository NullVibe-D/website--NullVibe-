# NullVibe hosted-site review · 4 November 2026

The public website was inspected at https://nullvibe.tech, and the fixes were implemented against organization main at `de43560`. The production site and the local release candidate are different targets. No real enquiry, calendar booking, DNS change or production promotion was made.

## What the visitor experiences

| Step | Public observation | Change and verification in the release candidate |
| --- | --- | --- |
| 1. Arrive | The header uses a flat mark on a black tile; the hero uses a separate metallic rendering. The headline and artwork fade in over 700–950 ms. All pages ship the same 100 KB compressed app. | Reused the actual silver-and-crimson sculpture at wordmark size (6.15 KB), with a stable reserved space. Copy and artwork paint immediately. Normal company pages serve HTML plus a small navigation enhancement; only contact and demos need React in the browser. |
| 2. Navigate | Mobile navigation needed the full application to load. Whole-document transitions also captured both pages on navigation. | Native mobile disclosure opens before JavaScript, supports keyboard access, closes on Escape/outside click and has a scrollable panel on short screens. Ordinary links navigate immediately. Hover and focus feedback remain, with reduced-motion support. |
| 3. Choose a service or read a guide | Some small labels, list numbers, FAQ indices and footers had insufficient contrast. A rule on the guides also applied the wrong text color to the enquiry button. | Corrected the shared styles, the guide button and question punctuation. Verified all generated internal links, page titles, canonical URLs and fragment targets, and that a service selection carries through to the enquiry form. |
| 4. Try a demo | Three links on some cards led to the same page. Accessible names did not match the preview text. A single product showed “1 items”; long conversations could leave the latest answer outside the chat viewport. | One labelled link per card, cart pluralization and automatic scrolling inside the chat log. Verified filtering, sample bookings, cart changes and simulated checkout, suggested questions and typed responses. No live reservations, payments or AI calls are implied. |
| 5. Enquire | The public send endpoint and health endpoint return 404. A visitor can encounter a Send button without an available delivery service. | Added Vercel Functions backed by the same validated delivery logic as the Node server. If delivery is unavailable the form explains the mode, offers a prefilled email draft and a downloadable brief. The send button is offered only after readiness. Tested native validation, retained inputs, retry, mocked provider rejection and acceptance, and actual downloadable text. Only a provider receipt allows a success response. |
| 6. Arrange a call | The booking page opens an email request. No scheduling URL is active, and public DNS returned no MX answer for the advertised email domain. | The fallback explicitly requests a conversation; it never reserves a slot. Verified the link target. Mailbox routing, real receipt, and any external scheduling confirmation still need owner-side setup and a live test. |

## Loading measurements

Three cold loads per revision on the same Windows machine and local Node origin configuration: Chromium, 390 × 844 CSS pixels, device scale 1, simulated 150 ms latency, 1.6 Mbps download and 4× CPU slowdown. Each run used a new browser context. The timing values below are medians. These are lab comparisons, not live visitor analytics or a universal device guarantee.

| Homepage | Previous build | Review build |
| --- | ---: | ---: |
| Initial JavaScript response, compressed | 100,112 bytes | 595 bytes |
| CSS response, compressed | 13.39 KB | 10.55 KB |
| Hero image selected at the test size | 41,954 bytes | 19,944 bytes |
| First contentful paint | 0.98 s | 1.02 s |
| Largest contentful paint | 1.64 s | 1.02 s |
| Cumulative layout shift during the sample | 0.0004 | 0.0069 |

The main element appeared about 38% sooner in this sample. First paint remained about one second and did not improve; the small layout shift increased. The build does not hide useful content behind an entrance animation. The live versioned script returned `max-age=0, must-revalidate`. The proposed Vercel configuration gives fingerprinted JS, CSS and fonts a one-year immutable cache, with a shorter one-hour cache for image paths that may be reused. HTML is not assigned the immutable policy.

## Verification

- **Live origin:** 22 sitemap pages × 390 and 1440 pixels (44 checks). All loaded over HTTPS with matching canonical references, a single H1, no horizontal overflow and no detected broken images. HTTP and www redirected to the canonical HTTPS domain; sitemap and robots responded; an unknown path returned 404.
- **Local production candidate:** 22 pages + 404 × four widths (320, 390, 768, 1440) × three engines = **276 layout checks**. Chromium 148, Firefox 157 and Playwright WebKit 27.2 passed the interaction suite, including keyboard FAQ/menu, no-JavaScript service navigation, reduced motion and the enquiry paths. No uncaught browser runtime errors recorded.
- **Accessibility:** 23 routes × three engines = **69 scans**, at mobile width with axe WCAG 2/2.1 A/AA tags. No violations detected in these scans. They do not cover every assistive technology, browser version, interaction state or physical device.
- **Server, adapters, packaging and build:** 29 automated tests passed. Covers bounded requests, consent, missing or invalid fields, origin validation, rate limits, provider timeouts and receipts, Vercel function exports, real HTTP statuses, static files, all 22 pages and link/asset integrity. Provider outcomes were simulated. The rate limit is per running instance.
- Updated the Vite patch release and affected build dependencies; the final npm advisory scan reported zero known vulnerabilities. This is a dependency check, not a security penetration test.

## Release boundary

A local preview can prove the built pages, browser behavior and function logic. It cannot verify production credentials, actual inbox delivery, a real scheduler or the behavior of a future production deployment. Before relying on enquiries, follow [the Vercel and mailbox handoff](docs/hosting-handoff.md). Do not mark a lead as delivered just because the site loads or because health reports configuration present.

## Repeat the checks

Build the site, run `npm run test:server`, `npm run test:sites` and `npm run test:build`. Start the local production preview. Set `TEST_URL` to its loopback URL, and run `npm run test:browser` with `TEST_BROWSER` set to `chromium`, `firefox` or `webkit` and the corresponding Playwright browser installed. Results are written to `qa/final/<engine>/`. Browser form tests intercept submissions; they do not email anyone.
