const puppeteer = require('puppeteer');
const axios = require('axios');

async function main() {
  // Login to get token and user
  const loginResp = await axios.post('http://localhost:8000/api/users/login', { email: 'e2e-test-owner@example.com', password: 'Testpass123!' });
  const loginJson = loginResp.data;
  const authData = loginJson.data;
  console.log('login token length', authData.token?.length || 0);

  const token = authData.token;
  const user = authData.user;

  const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  const page = await browser.newPage();
  // capture console messages for debugging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // open dev-login with token & user
  const encodedUser = encodeURIComponent(JSON.stringify(user));
  const frontendUrl = process.env.URL || 'http://localhost:5173';
  const url = `${frontendUrl}/dev-login?token=${token}&user=${encodedUser}`;
  console.log('visiting', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait and check final URL
  // Prefer waiting for navigation; fall back to a small timeout if needed
  try { await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }); } catch(_) { await page.waitForTimeout?.(2000); }
  const finalUrl = page.url();
  console.log('final url', finalUrl);

  if (finalUrl.includes('/owner/dashboard')) {
    console.log('E2E PASS: redirected to owner dashboard');
    await browser.close();
    process.exit(0);
  } else {
    console.error('E2E FAIL: final url', finalUrl);
    await browser.screenshot({ path: './e2e/fail-screenshot.png' });
    await browser.close();
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(2); });
