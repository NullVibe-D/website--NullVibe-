import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.TEST_URL || 'http://127.0.0.1:4175';
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
mkdirSync('qa/final',{recursive:true});
const results=[];const errors=[];const accessibility=[];
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
page.on('pageerror',e=>errors.push(e.message));
const routes=['/','/services','/process','/demos','/about','/faq','/contact','/booking','/privacy',...['web-applications','mobile-applications','ai-automation','websites-commerce','business-systems','support-evolution'].map(s=>'/services/'+s),...['booking','commerce','assistant'].map(s=>'/demos/'+s),'/missing'];
try {
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:900});
  for(const route of routes){
   const response=await page.goto(base+route);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.equal(response.status(),route==='/missing'?404:200,route+' HTTP status');
   assert.equal(await page.locator('h1').count(),1,route+' h1');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${route} overflow at ${width}px`);
   await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode().catch(()=>{}))));
   assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.some(i=>i.naturalWidth===0)),false,route+' broken image');
   results.push(`${width}px ${route}: passed`);
  }
 }
 console.log('76 route/viewport checks passed.');
 await page.setViewportSize({width:390,height:844});await page.goto(base);
 await page.getByRole('button',{name:'Open menu'}).click();assert.equal(await page.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
 await page.getByRole('button',{name:'Open menu'}).click();await page.locator('#navigation').getByRole('link',{name:'Services',exact:true}).click();await page.waitForURL('**/services');
 await page.getByRole('link',{name:'Explore this service'}).first().click();await page.waitForURL('**/services/web-applications');assert.match(await page.locator('h1').innerText(),/Web applications/);
 await page.goto(base+'/faq');await page.locator('summary').first().click();assert.equal(await page.locator('details').first().getAttribute('open'),'');await page.locator('summary').first().focus();await page.keyboard.press('Enter');assert.equal(await page.locator('details').first().getAttribute('open'),null);
 await page.goto(base+'/demos');await page.getByRole('button',{name:'Commerce',exact:true}).click();assert.equal(await page.locator('.demo-card').count(),1);
 await page.goto(base+'/demos/booking');assert.equal(await page.getByRole('button',{name:'Confirm demo appointment'}).isDisabled(),true);await page.getByRole('button',{name:'Tuesday',exact:true}).click();await page.getByRole('button',{name:'10:30',exact:true}).click();await page.getByRole('button',{name:'Confirm demo appointment'}).click();assert.match(await page.getByRole('status').innerText(),/Tuesday at 10:30/);
 await page.goto(base+'/demos/commerce');await page.getByRole('button',{name:'Add Studio tote',exact:true}).click();await page.getByRole('button',{name:'Add Everyday notebook',exact:true}).click();assert.match(await page.locator('.cart-total').innerText(),/66.00/);await page.getByRole('button',{name:'Remove Studio tote',exact:true}).click();assert.match(await page.locator('.cart-total').innerText(),/18.00/);await page.getByRole('button',{name:'Try demo checkout'}).click();assert.match(await page.getByRole('status').innerText(),/No payment/);
 await page.goto(base+'/demos/assistant');await page.getByRole('button',{name:'What does it cost?'}).click();assert.match(await page.getByRole('log').innerText(),/Pricing depends/);
 async function fillContact(){await page.getByLabel('Your name').fill('Test Visitor');await page.getByLabel('Email address').fill('test@example.com');await page.getByLabel('Tell us about your project').fill('We need a mobile booking application for our business.');await page.getByRole('checkbox').check();}
 await page.goto(base+'/contact?service=Mobile%20applications');await page.waitForFunction(()=>document.querySelector('select[name=service]').value==='Mobile applications');await fillContact();
 const health=await (await page.request.get(base+'/api/health')).json();assert.equal(health.contactConfigured,false,'Tests only submit to unconfigured endpoint; no real email permitted.');
 await page.getByRole('button',{name:'Send project enquiry'}).click();await page.getByRole('alert').waitFor();assert.match(await page.getByRole('alert').innerText(),/has not been sent/);assert.equal(await page.getByLabel('Your name').inputValue(),'Test Visitor');
 const dl=page.waitForEvent('download');await page.getByRole('button',{name:'Save brief'}).click();assert.equal((await dl).suggestedFilename(),'nullvibe-project-brief.txt');
 assert.match(await page.getByRole('link',{name:'Open enquiry in your email app'}).getAttribute('href'),/^mailto:contact@nullvibe.tech/);
 await page.route('**/api/contact',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,message:'Test acceptance'})}));
 await page.getByRole('button',{name:'Send project enquiry'}).click();await page.getByRole('status').waitFor();assert.match(await page.getByRole('status').innerText(),/Thank you/);await page.unroute('**/api/contact');
 await page.goto(base+'/contact');await fillContact();await page.route('**/api/contact',route=>route.fulfill({status:502,contentType:'application/json',body:JSON.stringify({ok:false,message:'Could not confirm delivery. Please try again.'})}));await page.getByRole('button',{name:'Send project enquiry'}).click();await page.getByRole('alert').waitFor();assert.match(await page.getByRole('alert').innerText(),/Could not confirm/);await page.unroute('**/api/contact');
 await page.goto(base+'/booking');assert.match(await page.getByRole('link',{name:'Request a call by email'}).getAttribute('href'),/^mailto:contact@nullvibe.tech/);
 assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base);assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'smooth');await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await page.waitForTimeout(1000);assert.equal(await page.locator('.cta .will-reveal:not(.is-visible)').count(),0);await page.emulateMedia({reducedMotion:'reduce'});
 results.push('Menu/escape, service navigation, keyboard FAQ, demo filters, booking/cart/assistant, contact unavailable/download/preserved form/mocked acceptance/mocked failure, email booking, motion preferences: passed');
 const noJS=await browser.newPage({javaScriptEnabled:false});await noJS.goto(base+'/services/web-applications');assert.match(await noJS.locator('h1').innerText(),/Web applications/);assert.ok((await noJS.locator('main').innerText()).includes('A typical engagement includes'));await noJS.close();results.push('Pre-rendered service content works without JavaScript: passed');
 for(const route of ['/','/services','/process','/demos','/about','/faq','/contact','/booking','/privacy','/services/web-applications','/demos/booking','/demos/commerce','/demos/assistant']){
  await page.setViewportSize({width:390,height:844});await page.goto(base+route);const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();accessibility.push({route,violations:scan.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
 }
 writeFileSync('qa/final/accessibility.json',JSON.stringify(accessibility,null,2));
 for(const [name,width,height,route] of [['home-desktop',1440,1000,'/'],['home-mobile',390,844,'/'],['process-desktop',1440,1000,'/process'],['services-mobile',390,844,'/services'],['contact-mobile',390,844,'/contact'],['booking-mobile',390,844,'/booking']]){await page.setViewportSize({width,height});await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`qa/final/${name}.png`,fullPage:true});}
 assert.deepEqual(errors,[],'No hydration or runtime errors');
 const violations=accessibility.flatMap(s=>s.violations.map(v=>({route:s.route,...v})));
 writeFileSync('qa/final/results.json',JSON.stringify({results,errors,accessibilityViolations:violations.length},null,2));
 console.log(JSON.stringify({checks:results.length,errors,accessibilityViolations:violations.length},null,2));
 if(violations.length){console.log(JSON.stringify(violations,null,2));process.exitCode=1;}
} finally {await browser.close();}
