# NullVibe production handoff

The website can run as a portable Node service. The frontend build is served from `dist/client`; `/api/contact` delivers enquiries through Resend when configured. It does not need a database. This repository is not evidence that a public deployment, a verified sending domain, a company mailbox, or a scheduling account exists.

## Build and run

Use Node.js 24 (verified locally with 24.19.0). From this website directory:

```sh
npm ci
npm run build
npm run test:server
npm start
```

The last command loads `.env.local` when present; use `.env.example` as the reference when filling missing settings, preserving any existing local values. A hosting platform can supply environment variables directly and run `node server/index.mjs` instead. Never commit local environment files or share them in a public artifact. The server binds to `127.0.0.1:4175` by default. Containers usually require `HOST=0.0.0.0` and the port supplied by the platform. Termination signals close the HTTP server gracefully.

## Configuration and launch dependencies

| Variable             | Where used       | Purpose                                                                                                                                                                                                    |
| -------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_CONTACT_EMAIL` | Build            | Optional public business email used in contact alternatives.                                                                                                                                               |
| `VITE_BOOKING_URL`   | Build            | Real HTTPS scheduling URL from your chosen calendar provider.                                                                                                                                              |
| `PUBLIC_SITE_URL`    | Build and server | Canonical HTTPS origin used for metadata, sitemap and robots, and allowed to submit enquiries. Configured as `https://nullvibe.tech`. No value on the server allows only matching HTTP localhost requests. |
| `RESEND_API_KEY`     | Server only      | Resend key authorized to send email.                                                                                                                                                                       |
| `CONTACT_TO_EMAIL`   | Server only      | Destination business mailbox. Plain email address.                                                                                                                                                         |
| `CONTACT_FROM_EMAIL` | Server only      | Sender address on a verified Resend domain. Plain email address.                                                                                                                                           |
| `HOST`, `PORT`       | Server           | Listener address and port.                                                                                                                                                                                 |
| `TRUST_PROXY`        | Server           | `1` only behind a single trusted proxy that overwrites incoming `X-Forwarded-For`. Defaults to disabled.                                                                                                   |

The owner has confirmed `nullvibe.tech` and `contact@nullvibe.tech`. Real scheduling availability, the verified sending address, email provider credentials, final privacy wording and hosting still need to be connected before a public launch. Set public variables before building; changing them requires another build. Server secrets must never have a `VITE_` prefix. Follow [Resend's sending API documentation](https://resend.com/docs/api-reference/emails/send-email) for verified sender setup and account restrictions.

For local review, `npm run preview:production` runs the compiled site while removing `PUBLIC_SITE_URL` from the server-only environment so the matching localhost origin can submit test enquiries. Production `npm start` uses the configured canonical origin. The helper changes no saved domain settings and does not make unconfigured email delivery succeed. It uses real provider credentials if they are configured, so use the mocked Node tests to verify delivery without sending messages.

Use HTTPS at the hosting platform or reverse proxy. Forward `/api/*` and page requests to this Node process, preserving the public Host and Origin headers. When `PUBLIC_SITE_URL` uses HTTPS, the server sets HSTS. The configured origin must exactly match the visitor-facing URL; redirect secondary domains to that origin. Do not expose the internal HTTP port directly when trusting a proxy.

## Routes, caching and browser protections

The server serves `/services` from `dist/client/services/index.html`, and follows the same pattern for other prerendered routes. Missing routes use `dist/client/404.html` with HTTP status 404 rather than silently returning the homepage. Missing assets also return 404. Dotfiles, traversal paths and links outside the build directory are not served.

HTML uses revalidation. Fingerprinted `/assets/*` files are cached immutably for one year; other static assets use a one-hour cache. ETags, HEAD requests and gzip for suitable text responses are supported. The server includes a Content Security Policy, clickjacking protection, MIME sniffing protection, a referrer policy and restricted browser permissions. The current policy allows local assets and external calendar links; introducing third-party scripts, images or embedded calendars requires a deliberate policy update.

## Enquiry API

`POST /api/contact` requires the visitor's matching `Origin`, `Content-Type: application/json`, and a body of at most 20 KiB:

```json
{
  "name": "Alex Example",
  "email": "alex@example.com",
  "company": "Example Company",
  "service": "Web applications",
  "budget": "Let's discuss",
  "message": "We would like to discuss a customer booking platform.",
  "website": "",
  "consent": true
}
```

The hidden `website` honeypot must remain empty. The server validates field types and lengths, requires consent and sends plain-text email with the visitor email as Reply-To. It does not write enquiry contents to local files or log personal information. The email provider and recipient mailbox receive the submitted information and manage their own retention. Public privacy copy must reflect that processing once delivery is enabled.

Only a successful provider response with a message identifier returns `{ "ok": true }`. This confirms provider acceptance, not eventual inbox delivery. A missing email configuration returns 503; invalid input returns 422 with field errors; provider failure or timeout returns 502. The frontend should retain the visitor's entries on errors and show an alternative contact method. Honeypot submissions do not send email and do not receive a fabricated success response.

The default rate limit is five attempts per IP address per fifteen minutes, with `429` and `Retry-After` when exceeded. It is intentionally in-memory and resets on restart. For multiple instances or substantial public traffic, add shared rate limiting and abuse controls at the hosting edge before scaling. Only enable `TRUST_PROXY=1` when your one trusted proxy strips and replaces forwarding headers; otherwise all visitors behind that proxy share the same limit. Origin checks and the honeypot complement rate limiting but are not full bot protection.

`GET /api/health` returns only `{ "status": "ok", "contactConfigured": false }` (or `true`). It never returns secret values. `contactConfigured` means the required variables are present and addresses pass basic validation; it does not prove domain verification, provider authorization or mailbox delivery. Missing build files must be caught during deployment by a request to `/`, in addition to the API health check.

## Verification and operations

The Node tests inject a fake email transport; running them never sends email. They cover validation, payload bounds, same-origin checks, rate limiting, honest unconfigured/provider-error responses, secret exposure, static routes, caching and response headers.

After deploying, confirm a real deep page returns HTML with status 200, an unknown route returns 404, the health endpoint responds, and the complete enquiry journey reaches the intended mailbox using a deliberately authorized test submission. Confirm delivery separately in the provider and mailbox, then test booking against actual calendar availability. Keep a previous build available for rollback. Monitor HTTP availability, server errors, provider delivery failures, and scheduling configuration. No production email or external booking has been created by the local verification.

The separate existing Sites worker and handoff files are retained. That static handoff does not automatically run this Node contact API; deploy this service or an equivalent correctly configured API before advertising working enquiry delivery on a static host.
