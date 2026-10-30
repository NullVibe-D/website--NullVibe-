import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const base=path.resolve('dist/client');
test('all canonical routes have unique prerendered content and metadata',async()=>{
 const sitemap=await readFile(path.join(base,'sitemap.xml'),'utf8');
 const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 assert.equal(urls.length,18);
 const titles=new Set();const descriptions=new Set();
 for(const url of urls){
  const route=new URL(url).pathname;const html=await readFile(path.join(base,route,'index.html'),'utf8');
  assert.match(html,/<main id="main">/);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route+' H1');
  const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title&&title.includes('NullVibe'));titles.add(title);
  const description=html.match(/name="description"\s+content="([^"]+)"/)?.[1];assert.ok(description?.length>30,route+' description');descriptions.add(description);
  assert.ok(html.includes(`rel="canonical" href="${url}"`),route+' canonical');assert.match(html,/application\/ld\+json/);
 }
 assert.equal(titles.size,18);assert.equal(descriptions.size,18);
});
test('404 is nonindexable and crawl resources refer to the public domain',async()=>{
 const notFound=await readFile(path.join(base,'404.html'),'utf8');assert.match(notFound,/noindex,follow/);assert.match(notFound,/back on track/);
 const robots=await readFile(path.join(base,'robots.txt'),'utf8');assert.match(robots,/Sitemap: https:\/\/nullvibe.tech\/sitemap.xml/);
});
