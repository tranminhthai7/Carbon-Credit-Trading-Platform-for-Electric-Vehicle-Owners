const puppeteer = require('puppeteer');
const axios = require('axios');

async function run() {
  const gateway = process.env.GATEWAY_URL || 'http://localhost:8000';
  const frontend = process.env.URL || 'http://localhost:5173';

  // Use seeded owner (seed script registers seed-seller@example.com as ev_owner)
  const email = process.env.TEST_EMAIL || 'seed-seller@example.com';
  const password = process.env.TEST_PASSWORD || 'Testpass123!';

  console.log('Logging in via API as', email);
  const loginResp = await axios.post(`${gateway}/api/users/login`, { email, password });
  const data = loginResp.data && loginResp.data.data ? loginResp.data.data : loginResp.data;
  const token = data.token;
  const user = data.user;

  if (!token || !user) {
    console.error('Failed to get token/user from login response', loginResp.data);
    process.exit(2);
  }

  console.log('Launching headless browser');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const consoleMessages = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(text);
    console.log('PAGE LOG:', text);
  });

  // Capture POST /api/vehicles network responses so we can inspect server body
  const apiResponses = [];
  page.on('response', async (resp) => {
    try {
      const req = resp.request();
      if (req && req.url && req.method && req.url().includes('/api/vehicles') && req.method() === 'POST') {
        const status = resp.status();
        let body = null;
        try { body = await resp.json(); } catch (e) { body = await resp.text().catch(()=>null); }
        apiResponses.push({ url: req.url(), status, body });
        console.log('API RESPONSE:', req.url(), status, body);
      }
    } catch (e) {
      // ignore listener errors
    }
  });

  const encUser = encodeURIComponent(JSON.stringify(user));
  const devLoginUrl = `${frontend}/dev-login?token=${token}&user=${encUser}`;
  console.log('Visiting dev-login to set auth session');
  await page.goto(devLoginUrl, { waitUntil: 'networkidle2', timeout: 60000 });

  // ensure navigation to owner dashboard
  let attemptedDuplicate = false;
  try {
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
  } catch (e) {
    if (page.waitForTimeout) await page.waitForTimeout(1000); else await new Promise(r => setTimeout(r, 1000));
  }

  console.log('Opening /owner/vehicles');
  await page.goto(`${frontend}/owner/vehicles`, { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait a short time for UI to render (compatible with older puppeteer versions)
  if (page.waitForTimeout) await page.waitForTimeout(1500); else await new Promise(r => setTimeout(r, 1500));

  // If there's a register form button, try to create a vehicle
  try {
    const foundRegister = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const candidates = buttons.filter(b => /Register Vehicle|Create vehicle|Register|Create/i.test(b.innerText));
      if (candidates.length === 0) return false;
      candidates[0].click();
      return true;
    });
    if (foundRegister) {
      console.log('Found register button and clicked it');
      if (page.waitForTimeout) await page.waitForTimeout(500); else await new Promise(r => setTimeout(r, 500));

      // Fill the form fields - we use placeholders/selectors where possible
      // Many inputs are TextField; fallback to any input types
      // Clear existing inputs and dispatch events so React-controlled fields update
      await page.evaluate(() => {
        Array.from(document.querySelectorAll('input')).forEach(i=>{
          i.value = '';
          i.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
      // Try to fill by label text using aria-label or placeholders
      const tryType = async (label, value) => {
        // 1) Try find a <label> with the text and use its htmlFor to locate input
        const idHandle = await page.evaluateHandle((lbl) => {
          const labels = Array.from(document.querySelectorAll('label'));
          const match = labels.find(l => (l.innerText || '').trim().toLowerCase().includes(lbl.toLowerCase()));
          if (match && match.htmlFor) return match.htmlFor;
          return null;
        }, label);
        const id = idHandle && (await idHandle.jsonValue());
        if (id) {
          const inputSel = `#${id}`;
          if (await page.$(inputSel)) {
            try { await page.focus(inputSel); await page.evaluate((s, v) => { const el = document.querySelector(s); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, inputSel, value); return; } catch(e){}
          }
        }

        // 2) try aria-label or placeholder
        const sel = `input[aria-label="${label}"]`;
        if (await page.$(sel)) { try { await page.type(sel, value).catch(()=>{}); return; } catch(e){} }
        const placeholderSel = `input[placeholder*="${label}"]`;
        if (await page.$(placeholderSel)) { try { await page.type(placeholderSel, value).catch(()=>{}); return; } catch(e){} }

        // 3) fallback: find inputs in dialog order and type into the first non-empty
        const inputs = await page.$$('input');
        for (let i = 0; i < inputs.length; i++) {
          try { await inputs[i].focus(); await inputs[i].type(value); break; } catch(e){}
        }
      };

      await tryType('Make', 'E2E-Make');
      await tryType('Model', 'E2E-Model');
      await tryType('Year', '2022');
      await tryType('Battery', '50');
      const plate = `E2E-${Date.now()}`;
      await tryType('License plate', plate);

      // Try to find Create/Submit button in the modal
      const clickedSubmit = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const match = btns.find(b => /Create Vehicle|Create|Save|Submit/i.test(b.innerText));
        if (!match) return false;
        match.click();
        return true;
      });
      if (clickedSubmit) {
        console.log('Submitting create vehicle form');
        if (page.waitForTimeout) await page.waitForTimeout(1200); else await new Promise(r => setTimeout(r, 1200));
      } else {
        console.warn('Could not locate submit button — skipping create');
      }
      // Wait for creation to settle then attempt to create again with the same
      // license plate — this verifies the server-side uniqueness check and
      // ensures the UI surfaces a validation error (409) rather than crashing.
      if (clickedSubmit) {
        if (page.waitForTimeout) await page.waitForTimeout(1000); else await new Promise(r => setTimeout(r, 1000));

        // Open the register dialog again (if UI allows)
        const openedAgain = await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => /Register Vehicle|Create vehicle|Register|Create/i.test(b.innerText));
          if (!btn) return false;
          btn.click();
          return true;
        });
        if (openedAgain) {
          console.log('Attempting to create a duplicate vehicle (expected to fail)');
          if (page.waitForTimeout) await page.waitForTimeout(300);

          // Fill the same values again and dispatch input events
          await page.evaluate((p) => {
            const inputs = Array.from(document.querySelectorAll('input'));
            if (inputs[0]) { inputs[0].value = 'E2E-Make'; inputs[0].dispatchEvent(new Event('input', { bubbles: true })); }
            if (inputs[1]) { inputs[1].value = 'E2E-Model'; inputs[1].dispatchEvent(new Event('input', { bubbles: true })); }
            if (inputs[2]) { inputs[2].value = '2022'; inputs[2].dispatchEvent(new Event('input', { bubbles: true })); }
            if (inputs[3]) { inputs[3].value = '50'; inputs[3].dispatchEvent(new Event('input', { bubbles: true })); }
            if (inputs[4]) { inputs[4].value = p; inputs[4].dispatchEvent(new Event('input', { bubbles: true })); }
          }, plate);

          const clickedSubmit2 = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const match = btns.find(b => /Create Vehicle|Create|Save|Submit/i.test(b.innerText));
            if (!match) return false;
            match.click();
            return true;
          });
          if (clickedSubmit2) {
            attemptedDuplicate = true;
            if (page.waitForTimeout) await page.waitForTimeout(800);
          }
        }
      }
    } else {
      console.warn('Register Vehicle button not found; maybe no UI or no permission');
    }
  } catch (err) {
    console.warn('Error attempting to create vehicle:', err.message || err);
  }

  // Wait a moment and collect console logs
  if (page.waitForTimeout) await page.waitForTimeout(1000); else await new Promise(r => setTimeout(r, 1000));

  const errorMsgs = consoleMessages.filter(t => /DataGrid|row.*id|A row was provided|missing id|id is required|Cannot read property|TypeError/i.test(t));

  if (errorMsgs.length > 0) {
    console.error('Found DataGrid/JS errors:', errorMsgs.join('\n'));
    await page.screenshot({ path: './frontend/e2e/vehicles-e2e-fail.png' });
    await browser.close();
    process.exit(3);
  }

  // If we attempted to create a duplicate vehicle, ensure the UI surfaced
  // a validation message for the license plate rather than failing silently.
  if (attemptedDuplicate) {
    const foundValidation = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('span, p, div, label')).map(n => n.innerText || '');
      return texts.some(t => /license plate already registered|already registered/i.test(t));
    });
    if (!foundValidation) {
      console.error('Duplicate vehicle create did not show validation message');
      await page.screenshot({ path: './frontend/e2e/vehicles-e2e-dup-missing.png' });
      await browser.close();
      process.exit(4);
    }
  }

  console.log('No DataGrid id errors found in console messages');
  await browser.close();
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(2); });
