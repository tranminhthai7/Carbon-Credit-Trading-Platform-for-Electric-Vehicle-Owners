const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
  try {
    const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8000';
    const frontendUrl = process.env.URL || 'http://localhost:5173';

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
      try {
        console.log('Request:', req.method(), req.url());
        if (req.method() === 'POST' && req.url().includes('/api/listings')) {
          req.postData() && console.log('Outgoing /api/listings body:', req.postData());
        }
      } catch (e) {
        console.warn('Error logging request', e);
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

    // Open Create dialog via exact button text search
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const target = buttons.find(b => b.textContent && b.textContent.trim().includes('Create New Listing'));
      if (target) {
        console.log('Clicking Create New Listing button via evaluate');
        target.click();
      } else {
        console.log('Create New Listing button not found in evaluate');
      }
    });
    // Wait for a dialog element to be visible
    await new Promise((resolve) => setTimeout(resolve, 500));
    const hasDialog = await page.evaluate(() => {
      const dialog = document.querySelector('div[role="dialog"]');
      return !!(dialog && (dialog.offsetParent !== null));
    });
    console.log('Has dialog visible? ', hasDialog);
    console.log('Has dialog visible?', hasDialog);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Fill form
    try {
      await page.type('input[label="Quantity (kg CO₂)"]', '10');
      await page.type('input[label="Price per Unit ($)"]', '5.0');
    } catch (err) {
      console.warn('Could not type into form using selectors, attempting alternate selectors...');
      await page.screenshot({ path: './e2e/debug-listing-fallback.png', fullPage: true });
      const html = await page.content();
      const fs = require('fs');
      fs.writeFileSync('./e2e/debug-listing-page.html', html);
      // Find number inputs via label text
      const labels = await page.$$eval('label', nodes => nodes.map(n => ({ htmlFor: n.htmlFor, text: n.textContent?.trim() })));
      const qLabel = labels.find(l => l.text && l.text.includes('Quantity'))?.htmlFor;
      const pLabel = labels.find(l => l.text && l.text.includes('Price per Unit'))?.htmlFor;
      let inputs = [];
      if (qLabel) {
        const qInputHandle = await page.evaluateHandle((id) => document.getElementById(id), qLabel);
        if (qInputHandle) inputs.push(qInputHandle.asElement());
      }
      if (pLabel) {
        const pInputHandle = await page.evaluateHandle((id) => document.getElementById(id), pLabel);
        if (pInputHandle) inputs.push(pInputHandle.asElement());
      }
      // Fallback to any number inputs
      if (inputs.length === 0) {
        inputs = await page.$$('input[type="number"]');
      }
      console.log('Number of inputs to populate', inputs.length);
      if (inputs.length >= 1) {
        const handle = inputs[0];
        await page.evaluate(el => { el.value = '10'; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, handle);
      }
      if (inputs.length >= 2) {
        const handle2 = inputs[1];
        await page.evaluate(el => { el.value = '5.0'; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, handle2);
      }
    }

    // Click Create button inside the dialog
    const clicked = await page.evaluate(() => {
      const dialog = document.querySelector('div[role="dialog"]');
      if (!dialog) return { clicked: false, reason: 'no dialog' };
      const btns = Array.from(dialog.querySelectorAll('button'));
      const createBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Create');
      if (!createBtn) return { clicked: false, reason: 'create btn not found' };
      const disabled = createBtn.disabled || createBtn.getAttribute('aria-disabled') === 'true' || createBtn.classList.contains('Mui-disabled');
      const text = createBtn.textContent && createBtn.textContent.trim();
      if (disabled) return { clicked: false, reason: 'disabled', text };
      createBtn.click();
      return { clicked: true, reason: 'clicked', text };
    });
    console.log('Create button click:', clicked);

    // Wait to capture network requests
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Error in debug script:', err);
    process.exit(1);
  }
})();
