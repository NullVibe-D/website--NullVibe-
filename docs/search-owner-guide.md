# NullVibe: deployment and search checks you can repeat

A deployment puts files on the web. Indexing means Google has selected a page for its index. Ranking is the position for a particular search, location and device. Only the first is immediate and under your control.

## After every release: prove what is public

1. In [GitHub](https://github.com/NullVibe-D/website--NullVibe-/commits/main/) copy the newest commit identifier. In the existing Vercel project's Deployments screen, open the production deployment. Match its source commit and confirm that nullvibe.tech is assigned to it. “Ready” on a preview address alone is insufficient. [Vercel deployment guide](https://vercel.com/docs/deployments/managing-deployments).
2. Open https://nullvibe.tech (not localhost). Use View Page Source and find **build-revision**. On Git-based builds with Vercel's system variables enabled, this is the full Git commit. If missing, compare the dashboard source and a feature unique to this release: “Before you build” on the web application service page.
3. Open https://nullvibe.tech/api/health. Expect JSON. A contactConfigured value of false means the enquiry flow should offer an email draft; true means settings are present, not that any message reached your mailbox. Separately verify receipt before counting enquiries.
4. Visit https://www.nullvibe.tech/services and check that it ends at https://nullvibe.tech/services. Open a made-up address: expect a not-found page with **404** in your browser's Network panel.
5. For the repeatable technical check, run `node scripts/check-seo.mjs` from the website folder. It only reads public URLs. It checks each sitemap page's response, title, description, H1, canonical, indexability tags and structured data, and follows HTML links from the homepage. Passing this test does not report your Google index status.

## Once: connect Google Search Console

1. Open [Search Console](https://search.google.com/search-console/). Add a **Domain** property named **nullvibe.tech** (no protocol). Choose DNS TXT verification. Copy Google's exact TXT value to the root of the authoritative DNS zone; add a record rather than replacing an existing one. Return to Search Console to verify. Keep that record. [Ownership instructions](https://support.google.com/webmasters/answer/9008080).
2. Open **Sitemaps** and submit **https://nullvibe.tech/sitemap.xml**. Check the last-read date, status and discovered URL count. The submitted sitemap contains 22 pages at the time of this release. “Success” means Google read the sitemap; it does not mean all pages rank. [Sitemaps report](https://support.google.com/webmasters/answer/7451001).
3. In **URL Inspection**, paste the homepage, /services/web-applications, /services/mobile-applications and /services/ai-automation one at a time as full public URLs. Read the indexed status first. Then select **Test live URL** to see whether the current release can be fetched. Inspect the rendered page, and compare the Google-selected canonical in the indexed report with the public URL. Request indexing after substantive changes; repeated requests are unnecessary. [URL Inspection guide](https://support.google.com/webmasters/answer/9012289).
4. In [Rich Results Test](https://search.google.com/test/rich-results), test a guide and a service page. Check eligible Article/breadcrumb data where applicable. The tool only reports Google's supported rich-result features; it is not a general SEO score. For speed use [PageSpeed Insights](https://pagespeed.web.dev/) on the homepage and a service page, on mobile. A new site may lack field data.

## What to measure and improve each month

In Performance → Search results, compare the last 28 days with the previous 28. Look at queries and pages together, and separate branded queries containing “nullvibe” from searches by people who don't know the name yet. If volumes are small, use a longer period. Track clicks and qualified enquiries alongside impressions. Average position is an aggregate, not a fixed rank. [Performance report definitions](https://support.google.com/webmasters/answer/7576553).

| Example visitor intent (hypotheses, not volume forecasts) | Page to improve | Useful proof to add |
| --- | --- | --- |
| “custom web application development” | /services/web-applications | A walk-through of the booking demo, including permissions and scope |
| “mobile app or web app for field staff” | /services/mobile-applications | A worked example of offline capture and sync, with limitations |
| “how to choose a workflow for AI automation” | /insights/where-ai-automation-helps | An illustrative pilot with a baseline, failure cases and human review |
| “custom software vs off the shelf” | /insights/custom-software-vs-off-the-shelf | A worked buy/build comparison with explicit assumptions |

If a page gets impressions but few clicks, compare its title and introduction with the actual searches. If clicks arrive but enquiries do not, check the offer, demo and contact path, including actual mailbox receipt. If a page has no impressions, inspect indexing and query demand before rewriting it. Keep demos labelled as demos; publish real case studies and business results only when you can substantiate them. No ranking or timeline is guaranteed. [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
