const puppeteer = require('puppeteer');

async function main() {
  const url = process.env.DEV_LOGIN || 'http://localhost:5173/';
  console.log('Visiting', url);
  const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    try { await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }); } catch (_) {}
    const finalUrl = page.url();
    console.log('final url', finalUrl);
    await page.screenshot({ path: './e2e/visual-open.png', fullPage: true });
    console.log('Saved screenshot to ./e2e/visual-open.png');
  } catch (err) {
    console.error(err);
    await page.screenshot({ path: './e2e/visual-open-error.png', fullPage: true });
    console.log('Saved screenshot of failure to ./e2e/visual-open-error.png');
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
