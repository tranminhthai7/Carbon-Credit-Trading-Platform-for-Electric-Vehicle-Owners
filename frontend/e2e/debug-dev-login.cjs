const puppeteer = require('puppeteer');
const fs = require('fs');

async function main() {
  const url = process.env.DEV_LOGIN || 'http://localhost:5173/dev-login?token=fake&user={}'
  const logs = [];
  const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  const page = await browser.newPage();
  page.setCacheEnabled(false);

  page.on('console', msg => {
    const text = msg.text();
    const location = msg.location ? JSON.stringify(msg.location) : '';
    logs.push({ type: 'console', text, location });
    console.log('PAGE LOG:', text);
  });

  page.on('pageerror', err => {
    logs.push({ type: 'pageerror', text: err.message, stack: err.stack });
    console.error('PAGE ERROR:', err.stack || err.message);
  });

  page.on('requestfailed', req => {
    logs.push({ type: 'requestfailed', url: req.url(), method: req.method(), headers: req.headers(), failure: req.failure() });
    console.log('REQUEST FAILED:', req.url(), req.failure());
  });

  page.on('requestfinished', async (req) => {
    const res = req.response();
    if (!res) return;
    const url = req.url();
    if (url.includes('/api/') || url.includes('/assets/')) {
      const status = res.status();
      logs.push({ type: 'requestfinished', url, status });
      console.log('REQUEST FINISHED:', status, url);
    }
  });

  try {
    console.log('Visiting', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (err) {
    console.error('Goto error', err.message);
  }

  // Wait briefly (small sleep) for any JS to run on page
  await new Promise(res => setTimeout(res, 1500));
  // Evaluate DOM and localStorage state for debugging
  const domInfo = await page.evaluate(() => {
    try {
      const root = document.getElementById('root') || document.getElementById('app') || document.body;
      const html = root ? root.innerHTML : document.documentElement.innerHTML;
      const token = window.localStorage?.getItem('token');
      const user = window.localStorage?.getItem('user');
      const title = document.title;
      return { htmlLength: html ? html.length : 0, token: token || null, user: user || null, title };
    } catch (e) {
      return { error: String(e) };
    }
  });
  logs.push({ type: 'dom', domInfo });
  console.log('DOM info:', domInfo);
  const finalUrl = page.url();
  console.log('Final URL:', finalUrl);
    await page.screenshot({ path: './e2e/debug-dev-login.png', fullPage: true });

  fs.writeFileSync('./e2e/debug-dev-login-logs.json', JSON.stringify(logs, null, 2));
    fs.writeFileSync('./e2e/debug-dev-login-logs.json', JSON.stringify(logs, null, 2));
  await browser.close();
}

main().catch(err => { console.error('fatal', err); process.exit(2); });
