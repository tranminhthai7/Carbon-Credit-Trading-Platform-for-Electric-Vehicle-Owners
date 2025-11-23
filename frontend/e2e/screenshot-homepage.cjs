const puppeteer = require('puppeteer');

(async () => {
  const url = process.env.URL || 'http://127.0.0.1:8081/';
  console.log('Taking screenshot of', url);
  const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    // Wait a bit for redirect to complete
    try { await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 2000 }); } catch (_) { await page.waitForTimeout?.(1500); }
    const finalUrl = page.url();
    console.log('Final URL after redirect:', finalUrl);
    // Save screenshot
    const out = './e2e/homepage.png';
    await page.screenshot({ path: out, fullPage: true });
    console.log('Screenshot saved as', out);
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Error taking screenshot', err);
    await page.screenshot({ path: './e2e/homepage-error.png', fullPage: true });
    await browser.close();
    process.exit(1);
  }
})();
