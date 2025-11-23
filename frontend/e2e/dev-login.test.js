const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

async function main() {
  // First, create a dev user with API.
  const registerResp = await fetch('http://localhost:8000/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'puppeteer-dev@local.test', password: 'Testpass123!', full_name: 'Puppeteer Dev', role: 'ev_owner' })
  });
  const registerJson = await registerResp.json();
  console.log('register result', registerJson.success, registerJson.message);

  // Login to get token and user
  const loginResp = await fetch('http://localhost:8000/api/users/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'puppeteer-dev@local.test', password: 'Testpass123!' })
  });
  const loginJson = await loginResp.json();
  const authData = loginJson.data;
  console.log('login token length', authData.token?.length || 0);

  const token = authData.token;
  const user = authData.user;

  const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
  const page = await browser.newPage();

  // open dev-login with token & user
  const encodedUser = encodeURIComponent(JSON.stringify(user));
  const url = `http://localhost:8081/dev-login?token=${token}&user=${encodedUser}`;
  console.log('visiting', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait and check final URL
  try { await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }); } catch (_) { await page.waitForTimeout?.(2000); }
  const finalUrl = page.url();
  console.log('final url', finalUrl);

  if (finalUrl.includes('/owner/dashboard')) {
    console.log('E2E PASS: redirected to owner dashboard');
    await browser.close();
    process.exit(0);
  } else {
    console.error('E2E FAIL: final url', finalUrl);
    await page.screenshot({ path: './e2e/fail-screenshot.png' });
    await browser.close();
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(2); });
