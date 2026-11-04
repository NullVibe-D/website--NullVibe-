# Vercel release and mailbox handoff

Production: https://nullvibe.tech • Repository: NullVibe-D/website--NullVibe- • Public address: contact@nullvibe.tech.

The 4 November 2026 inspection found a working HTTPS website with 22 published pages, but both API paths returned 404 and a public DNS lookup returned no MX answer. These are observations about that deployment. The fixes in this checkout require a new deployment.

1. **Inbox first.** Identify the provider hosting the contact mailbox and confirm the mailbox exists. In the authoritative DNS zone, add the exact MX priorities and targets supplied by that provider. Keep the website records. Add the provider's authentication records as instructed; receiving mail and authorizing the website to send mail are separate steps. Verify that an external email reaches the inbox and that a reply works.
2. **Build a review deployment** from this revision, using the repository root, Node 22 or 24, the included Vite build and `dist/client` output. The `api` directory must be deployed alongside the static output; uploading the output folder on its own does not install the backend. Open a deep link, visit an invalid path and inspect `/api/health`: expect JSON with status ok, and contactConfigured false on a Vercel preview.
3. **Set server-only production values** for `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (verified sender), `CONTACT_TO_EMAIL=contact@nullvibe.tech` and `PUBLIC_SITE_URL=https://nullvibe.tech`. Set `VITE_BOOKING_URL` only if a real scheduling link is ready; it is embedded at build time. Enter secrets in Vercel directly. Do not send them in chat or commit them.
4. **Release and verify.** Publish the reviewed revision to the existing Vercel project. Confirm the same 22 pages and HTTPS redirects; missing pages must remain 404. Inspect health on the canonical domain. A true value confirms configuration is present, not that the provider will accept mail. Send one authorized enquiry, verify inbox arrival and Reply-To, and test the calendar only if enabled. Keep the previous deployment available to roll back.
5. **Ongoing checks.** Watch provider rejections and bounces and Vercel function errors. The in-process anti-abuse limit applies per running instance. For distributed production limits, configure a platform rule for POST /api/contact.

Vercel previews intentionally do not deliver email. The site offers an email draft and a downloadable brief when online delivery is unavailable. Opening a draft alone does not send it, and requesting a call by email does not reserve a slot.
