const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

async function main() {
  const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8000';
  const frontendUrl = process.env.URL || 'http://localhost:5173';
  const email = process.env.EMAIL || 'visual-manual-134079948730555784@example.com';
  const password = process.env.PASSWORD || 'VisualPass123!';

  const logs = [];
  const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => {
    logs.push({ type: 'console', text: msg.text() });
    console.log('PAGE LOG:', msg.text());
  });
  page.on('pageerror', err => logs.push({ type: 'pageerror', text: err.stack || err.message }));
  page.on('requestfailed', req => logs.push({ type: 'requestfailed', url: req.url(), failure: req.failure() }));
  page.on('requestfinished', req => { const res = req.response(); if (!res) return; logs.push({ type: 'requestfinished', url: req.url(), status: res.status() }); });

  // Login via API to get token & user
  console.log('Logging in via API...');
  const loginResp = await axios.post(`${gatewayUrl}/api/users/login`, { email, password });
  const authData = loginResp.data.data;
  const token = authData.token;
  const user = authData.user;

  console.log('Got token, setting localStorage');
  await page.goto(`${frontendUrl}/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate((token, user) => {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user', JSON.stringify(user));
  }, token, user);

  // Now open /owner/dashboard directly to avoid relying on redirect
  const url = `${frontendUrl}/owner/dashboard`;
  console.log('Opening', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }).catch(err => { console.error('goto error', err.message); });

  // Wait briefly
  await new Promise(res => setTimeout(res, 1500));

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

  const finalUrl = page.url();
  console.log('Final URL:', finalUrl);
  console.log('DOM info:', domInfo);
  logs.push({ type: 'dom', domInfo });

  await page.screenshot({ path: './e2e/login-dashboard-screenshot.png', fullPage: true });
  fs.writeFileSync('./e2e/login-dashboard-logs.json', JSON.stringify(logs, null, 2));

  const pageErrors = logs.filter(l => l.type === 'pageerror');
  if (pageErrors.length > 0) {
    console.error('Pageerrors found during login-open-dashboard:', JSON.stringify(pageErrors, null, 2));
    process.exit(2);
  }
  await browser.close();
}

main().catch(err => { console.error('fatal', err); process.exit(2); });
