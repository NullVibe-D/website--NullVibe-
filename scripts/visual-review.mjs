import {chromium} from 'playwright';
const browser=await chromium.launch({executablePath:'C:/Users/Lenovo/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const [name,route,width] of [['review-home','/',1440],['review-process','/process',1440],['review-mobile','/',390]]){
 await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:4175'+route);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`qa/${name}.png`,fullPage:true});
}
console.log(JSON.stringify({errors}));await browser.close();
