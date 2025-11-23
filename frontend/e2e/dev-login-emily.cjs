const puppeteer = require('puppeteer');
const axios = require('axios');

async function main() {
  const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8000';
  const frontendUrl = process.env.URL || 'http://localhost:5173';
  const email = process.env.EMAIL || 'emily.foster@university.edu';
  const password = process.env.PASSWORD || 'UserPass123!';

  // Login to get token and user
  const loginResp = await axios.post(`${gatewayUrl}/api/users/login`, { email, password });
  const loginJson = loginResp.data;
  const authData = loginJson.data;
  console.log('login token length', authData.token?.length || 0);

  const token = authData.token;
  const user = authData.user;

  const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  // capture console messages for debugging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // open dev-login with token & user
  const encodedUser = encodeURIComponent(JSON.stringify(user));
  const url = `${frontendUrl}/dev-login?token=${token}&user=${encodedUser}`;
  console.log('visiting', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait and check final URL
  try { await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }); } catch(_) { await page.waitForTimeout?.(2000); }
  const finalUrl = page.url();
  console.log('final url', finalUrl);

  if (finalUrl.includes('/owner/dashboard') || finalUrl.includes('/ev-owner/dashboard')) {
    console.log('E2E PASS: redirected to owner dashboard');
    await page.screenshot({ path: './e2e/emily-success.png', fullPage: true });
    await browser.close();
    process.exit(0);
  } else {
    console.error('E2E FAIL: final url', finalUrl);
    await page.screenshot({ path: './e2e/emily-fail.png', fullPage: true });
    await browser.close();
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(2); });
