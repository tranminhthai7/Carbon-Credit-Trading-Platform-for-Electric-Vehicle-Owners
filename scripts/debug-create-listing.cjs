const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
  try {
    const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8000';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Register a seller user via API
    const email = `debug-seller-${Date.now()}@example.com`;
    const password = 'Testpass123!';

    await axios.post(`${gatewayUrl}/api/users/register`, { email, password, role: 'ev_owner', full_name: 'Debug Seller' }).catch(() => {});
    // Verify may not be necessary; attempt to log in
    const loginResp = await axios.post(`${gatewayUrl}/api/users/login`, { email, password });
    const { token, user } = loginResp.data.data;
    console.log('Logged in as:', user.id);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Intercept network requests to log POST to /api/listings
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (req.method() === 'POST' && req.url().includes('/api/listings')) {
        req.postData() && console.log('Outgoing /api/listings body:', req.postData());
      }
      req.continue();
    });

    // Set token and user in localStorage
    await page.goto(frontendUrl, { waitUntil: 'networkidle2' });
    await page.evaluate((t, u) => {
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
    }, token, user);

    // Navigate to Create Listing UI
    await page.goto(`${frontendUrl}/owner/listings`, { waitUntil: 'networkidle2' });

    // Wait for form elements to be present and fill them
    await page.waitForSelector('input[label="Quantity (kg CO₂)"]', { timeout: 5000 }).catch(() => {});
    // Fallback selectors based on markup
    const qSelector = 'input[aria-label="Quantity (kg CO₂)"]';
    const pSelector = 'input[aria-label="Price per Unit ($)"]';

    // Click 'Create New Listing' to open dialog
    await page.click('button:has-text("Create New Listing")').catch(() => {});
    await page.waitForTimeout(500);

    // Fill form (if fields exist)
    await page.type(qSelector, '10').catch(() => {});
    await page.type(pSelector, '5.0').catch(() => {});

    // Click Create button
    await page.click('button:has-text("Create")').catch(() => {});

    // Wait to capture network requests
    await page.waitForTimeout(2000);

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Error in debug script:', err);
    process.exit(1);
  }
})();
