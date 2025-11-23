const puppeteer = require('puppeteer');
const axios = require('axios');

(async function main() {
  try {
    const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8000';
    const frontendUrl = process.env.URL || 'http://localhost:5173';
    const email = process.env.EMAIL || 'seed-seller@example.com';
    const password = process.env.PASSWORD || 'Testpass123!';

    console.log('Logging in via API...');
    const loginResp = await axios.post(`${gatewayUrl}/api/users/login`, { email, password });
    const authData = loginResp.data.data;
    console.log('Token length', (authData.token || '').length);
    const token = authData.token;
    const user = authData.user;

    const encodedUser = encodeURIComponent(JSON.stringify(user));
    const url = `${frontendUrl}/dev-login?token=${token}&user=${encodedUser}`;

    const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

    console.log('Visiting', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    // Wait for navigation to redirect to dashboard
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
    } catch (err) {
      // navigation may already have happened, that's fine
    }
    const finalUrl = page.url();
    console.log('final url', finalUrl);
    await page.screenshot({ path: './frontend/e2e/check-login-homepage.png', fullPage: true });
    await browser.close();

    if (finalUrl.includes('/owner/dashboard') || finalUrl.includes('/dashboard')) {
      console.log('✅ Login flow succeeded. Dashboard is shown.');
      process.exit(0);
    } else {
      console.log('⚠️ Not redirected to dashboard (final URL):', finalUrl);
      process.exit(2);
    }
  } catch (err) {
    console.error('Error:', err.response?.data || err.message || err);
    process.exit(3);
  }
})();
