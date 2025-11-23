#!/usr/bin/env node
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8000';
const frontendUrl = process.env.URL || 'http://localhost:5173';

async function register(email, password, role = 'ev_owner') {
  try {
    const res = await axios.post(`${gatewayUrl}/api/users/register`, { email, password, role, full_name: 'E2E User' });
    return res.data;
  } catch (err) {
    // ignore if user exists
    return { success: false, error: err.response?.data || err.message };
  }
}

async function getLastVerificationToken() {
  try {
    const res = await axios.get(`${gatewayUrl}/api/users/internal/last-verification-token`);
    return res.data.data.token;
  } catch (err) {
    return null;
  }
}

async function verifyToken(token) {
  return axios.get(`${gatewayUrl}/api/users/verify/${token}`);
}

async function login(email, password) {
  return axios.post(`${gatewayUrl}/api/users/login`, { email, password });
}

(async function main(){
  const email = process.env.EMAIL || `register-e2e+${Date.now()}@local.test`;
  const password = process.env.PASSWORD || 'Testpass123!';
  console.log('Registering', email);
  await register(email, password);
  await new Promise(r => setTimeout(r, 500));

  console.log('Fetching verification token');
  const token = await getLastVerificationToken();
  if (!token) {
    console.error('No verification token found');
    process.exit(2);
  }
  console.log('Verifying token', token);
  await verifyToken(token);

  console.log('Logging in');
  const loginResp = await login(email, password);
  const authData = loginResp.data.data;
  const tokenStr = authData.token;
  const user = authData.user;

  console.log('Launching headless browser and navigating to dashboard');
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'], headless: true });
  const page = await browser.newPage();

  // capture console logs
  const logs = [];
  page.on('console', msg => logs.push({ type: 'console', text: msg.text() }));
  page.on('pageerror', err => logs.push({ type: 'pageerror', text: err.stack || err.message }));

  await page.goto(`${frontendUrl}`, { waitUntil: 'networkidle2' });
  await page.evaluate((t, u) => { window.localStorage.setItem('token', t); window.localStorage.setItem('user', JSON.stringify(u)); }, tokenStr, user);
  await page.goto(`${frontendUrl}/owner/dashboard`, { waitUntil: 'networkidle2' });
  try { await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 3000 }); } catch (_) { await page.waitForTimeout?.(1000); }

  const title = await page.title();
  const htmlLength = await page.evaluate(() => document.documentElement.innerHTML.length);
  console.log({ title, htmlLength });

  await page.screenshot({ path: './e2e/register-verify-login-screenshot.png', fullPage: true });
  fs.writeFileSync('./e2e/register-verify-login-logs.json', JSON.stringify(logs, null, 2));

  // Fail if any page errors were recorded
  const pageErrors = logs.filter(l => l.type === 'pageerror');
  if (pageErrors.length > 0) {
    console.error('Page errors detected:', JSON.stringify(pageErrors, null, 2));
    process.exit(2);
  }

  await browser.close();
  console.log('Done');
  process.exit(htmlLength > 1000 ? 0 : 1);
})();
