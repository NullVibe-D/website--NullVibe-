import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const base=path.resolve('dist/client');
test('all canonical routes have unique prerendered content and metadata',async()=>{
 const sitemap=await readFile(path.join(base,'sitemap.xml'),'utf8');
 const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 assert.equal(urls.length,22);
 const titles=new Set();const descriptions=new Set();
 for(const url of urls){
  const route=new URL(url).pathname;const html=await readFile(path.join(base,route,'index.html'),'utf8');
  assert.match(html,/<main id="main">/);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route+' H1');
  const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title&&title.includes('NullVibe'));titles.add(title);
  const description=html.match(/name="description"\s+content="([^"]+)"/)?.[1];assert.ok(description?.length>30,route+' description');descriptions.add(description);
  assert.ok(html.includes(`rel="canonical" href="${url}"`),route+' canonical');assert.match(html,/application\/ld\+json/);
 }
 assert.equal(titles.size,22);assert.equal(descriptions.size,22);
});
test('404 is nonindexable and crawl resources refer to the public domain',async()=>{
 const notFound=await readFile(path.join(base,'404.html'),'utf8');assert.match(notFound,/noindex,follow/);assert.match(notFound,/back on track/);
 const robots=await readFile(path.join(base,'robots.txt'),'utf8');assert.match(robots,/Sitemap: https:\/\/nullvibe.tech\/sitemap.xml/);
});

test("marketing pages use static HTML; only enquiry and demos load their interactive code",async()=>{
 const read=route=>readFile(path.join(base,route,"index.html"),"utf8");
 for(const route of ["","about","services/mobile-applications","insights","booking","faq"]){
  const html=await read(route); assert.equal((html.match(/<script type="module"/g)||[]).length,1,route);assert.ok(!html.includes('rel="modulepreload"'),route);assert.match(html,/<details class="mobile-menu">/);
 }
 for(const route of ["contact","demos","demos/assistant"]){const html=await read(route);assert.equal((html.match(/<script type="module"/g)||[]).length,2,route);assert.match(html,/rel="modulepreload"/);}
});

test("all generated internal links, fragments and first-party assets resolve in the shipping build",async()=>{
 const sitemap = await readFile(path.join(base,"sitemap.xml"),"utf8");
 const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 const known = new Map();
 for (const url of urls) known.set(new URL(url).pathname, await readFile(path.join(base,new URL(url).pathname,"index.html"),"utf8"));
 const assets = new Set();
 for (const [route,html] of known) {
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    const target=new URL(m[1].replaceAll("&amp;","&"),"https://nullvibe.tech"+route);
    if(target.origin!=="https://nullvibe.tech")continue;
    assert.ok(known.has(target.pathname),route+" broken link: "+m[1]);
    if(target.hash)assert.ok(known.get(target.pathname).includes('id="'+decodeURIComponent(target.hash.slice(1))+'"'),route+" missing fragment: "+target.hash);
  }
  for(const m of html.matchAll(/(?:href|src)="(\/(?:images|assets)\/[^"]+)"/g))assets.add(m[1]);
 }
 for(const asset of assets)assert.ok((await readFile(path.join(base,asset))).length>0,asset);
});
