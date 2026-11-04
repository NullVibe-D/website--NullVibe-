// Read-only smoke test for NullVibe's generated HTML, not a Google indexing test.
import assert from "node:assert/strict";
const base = new URL(process.argv[2] || "https://nullvibe.tech").origin;
const canonical = "https://nullvibe.tech";
const get = path => fetch(base + path, {signal: AbortSignal.timeout(20000),redirect:"manual"});
async function ok(path) {
  const r=await get(path);assert.equal(r.status,200,path+" must respond directly");
  assert.doesNotMatch(r.headers.get("x-robots-tag")||"",/\b(noindex|none)\b/i,path+" blocked by header");
  return r.text();
}
const robots=await ok("/robots.txt");
assert.match(robots,/^Sitemap: https:\/\/nullvibe\.tech\/sitemap\.xml\s*$/m);
assert.doesNotMatch(robots,/^Disallow:\s*\/\s*$/m);
const urls=[...(await ok("/sitemap.xml")).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.ok(urls.includes(canonical+"/"));assert.equal(urls.length,new Set(urls).size);
const titles=new Set(), descriptions=new Set(), links=new Map();
for(const url of urls){
 const u=new URL(url);assert.equal(u.origin,canonical);const html=await ok(u.pathname);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,url+" H1");
 assert.ok(html.includes('rel="canonical" href="'+url+'"'),url+" canonical");
 assert.doesNotMatch(html,/<meta[^>]*name="(?:robots|googlebot)"[^>]*content="[^"]*(?:noindex|none)/i,url+" not indexable");
 for(const [set,pattern] of [[titles,/<title>([^<]+)<\/title>/],[descriptions,/name="description"\s+content="([^"]+)"/]]){
  const v=html.match(pattern)?.[1];assert.ok(v&&!set.has(v),url+" missing or duplicate metadata");set.add(v);
 }
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1])["@graph"];
 assert.ok(graph.some(n=>n["@type"]==="WebPage"&&n.url===url),url+" missing WebPage");
 links.set(url,[...html.matchAll(/<a\b[^>]*?href="([^"]+)"/g)].map(m=>new URL(m[1],url)).filter(l=>l.origin===canonical).map(l=>l.origin+l.pathname));
 if(u.pathname==="/")console.log("Build revision:",html.match(/name="build-revision" content="([^"]+)"/)?.[1]||"not exposed by this build");
}
const reached=new Set();function walk(url){if(reached.has(url))return;reached.add(url);for(const link of links.get(url)||[])if(links.has(link))walk(link);}
walk(canonical+"/");assert.equal(reached.size,urls.length,"Some sitemap pages cannot be reached from the homepage via links");
assert.equal((await get("/nullvibe-seo-missing-page-check")).status,404);
console.log(base+": "+urls.length+" linked pages passed HTTP, title, description, H1, canonical, indexability markup and JSON-LD checks; robots, sitemap and 404 passed.");
