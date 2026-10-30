# Deployment handoff

Confirmed: canonical domain https://nullvibe.tech and public contact contact@nullvibe.tech. Hosting is explicitly deferred by the owner.

## Required at hosting stage

1. Hosting account/project access through a connected service or secure local login. For the included Node server: build `npm run build`, start `node server/index.mjs`, Node22+, HOST=0.0.0.0 when required by the host, PORT supplied by the platform.
2. Domain registrar/DNS access to connect nullvibe.tech and redirect secondary hostnames to the canonical origin.
3. Resend account and server-only API key; DNS access for sender-domain verification. Supply the verified CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL=contact@nullvibe.tech. Mailbox hosting alone does not authorize this application to send email.
4. Optional calendar scheduling link with actual availability, timezone and duration configured. Without it the live site can use the implemented email call-request flow.
5. Confirm the company copy, privacy notice and any required business registration/contact details before public launch.

Enter secrets in hosting settings or a local ignored environment file. No credentials need to be posted into chat.

## Final checks after hosting

- HTTPS and both intended hostnames redirect correctly.
- All18 pages have correct titles, content, canonical URLs and direct-route loading.
- One owner-approved real enquiry arrives and reply-to is correct.
- Calendar booking, if enabled, creates an actual provider confirmation.
- Sitemap, robots,404 and asset caching behave correctly.
- Recheck accessibility, mobile behavior and performance on the public URL.

No public deployment or live email/calendar verification has occurred during local development.
