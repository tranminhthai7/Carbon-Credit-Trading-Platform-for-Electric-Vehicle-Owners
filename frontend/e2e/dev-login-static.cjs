const puppeteer = require('puppeteer');
const axios = require('axios');

async function main() {
  // Login to get token and user
  const registerResp = await axios.post('http://localhost:8000/api/users/register', {
    email: `puppeteer-static-${Date.now()}@example.com`,
    password: 'Testpass123!',
    role: 'ev_owner',
    full_name: 'Puppeteer Static'
  });
  console.log('registered', registerResp.data.success);

  const loginResp = await axios.post('http://localhost:8000/api/users/login', { email: registerResp.data.data.user.email, password: 'Testpass123!' });
  const authData = loginResp.data.data;
  console.log('login token len', authData.token?.length || 0);

  const token = authData.token;
  const user = authData.user;

  const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Open static index page first
  const base = 'http://localhost:5173';
  await page.goto(base, { waitUntil: 'networkidle2', timeout: 30000 });

  // Set localStorage with token & user, then navigate to /dashboard
  await page.evaluate((token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = '/owner/dashboard';
  }, token, user);

  // Wait for navigation to dashboard to finish
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
  const finalUrl = page.url();
  console.log('final url', finalUrl);

  if (finalUrl.includes('/owner/dashboard') || finalUrl.includes('/dashboard')) {
    console.log('E2E PASS: redirected to owner dashboard');
    await browser.close();
    process.exit(0);
  } else {
    console.error('E2E FAIL: final url', finalUrl);
    await browser.screenshot({ path: './e2e/fail-static-screenshot.png' });
    await browser.close();
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(2); });
