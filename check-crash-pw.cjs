const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('https://hcdoppio.vercel.app', { waitUntil: 'networkidle' });
  
  console.log('Clicking PIN...');
  await page.click('button:has-text("2")');
  await page.click('button:has-text("5")');
  await page.click('button:has-text("9")');
  await page.click('button:has-text("3")');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(2000);
  
  const html = await page.content();
  fs.writeFileSync('page-loggedin.html', html);
  console.log('Saved page-loggedin.html');
  
  await browser.close();
})();
