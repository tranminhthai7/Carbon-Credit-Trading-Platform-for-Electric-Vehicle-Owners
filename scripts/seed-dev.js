#!/usr/bin/env node
const axios = require('axios');

const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8000';
const rawArgs = process.argv.slice(2);
const opts = { dryRun: rawArgs.includes('--dry-run'), forceDb: rawArgs.includes('--force-db') };
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === '--seller-email' && rawArgs[i + 1]) { opts.sellerEmail = rawArgs[i + 1]; i++; }
  if (rawArgs[i] === '--buyer-email' && rawArgs[i + 1]) { opts.buyerEmail = rawArgs[i + 1]; i++; }
}

// DB containers and helpers for force-db mode
const { execSync } = require('child_process');
function child_exec_sync(cmd, captureOutput = false) {
  try {
    if (captureOutput) return execSync(cmd, { encoding: 'utf8' }).trim();
    execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    console.warn('cmd failed', cmd, e.message || e);
    return null;
  }
}
function runPsql(container, dbUser, dbName, sql, captureOutput = false) {
  sql = sql.replace(/"/g, '\\"');
  const flags = captureOutput ? '-t -A' : '';
  const cmd = `docker exec -i ${container} psql -U ${dbUser} -d ${dbName} ${flags} -c "${sql}"`;
  if (opts.dryRun) {
    console.log('[DRY-RUN] psql command:', cmd);
    return null;
  }
  return child_exec_sync(cmd, captureOutput);
}
function parseIdFromPsql(str) {
  if (!str) return null;
  const lines = str.trim().split('\n').map(l => l.trim()).filter(Boolean);
  for (const l of lines) {
    if (/^[0-9a-fA-F\-]{36}$/.test(l)) return l;
  }
  return null;
}
const CARBON_DB_CONTAINER = process.env.CARBON_DB_CONTAINER || 'carbon-db';
const CARBON_DB_USER = process.env.CARBON_DB_USER || 'admin';
const CARBON_DB_NAME = process.env.CARBON_DB_NAME || 'carbon_credit_db';
const MARKETPLACE_DB_CONTAINER = process.env.MARKETPLACE_DB_CONTAINER || 'marketplace-db';
const MARKETPLACE_DB_USER = process.env.MARKETPLACE_DB_USER || 'admin';
const MARKETPLACE_DB_NAME = process.env.MARKETPLACE_DB_NAME || 'marketplace_db';
const VERIFICATION_DB_CONTAINER = process.env.VERIFICATION_DB_CONTAINER || 'verification-db';
const VERIFICATION_DB_USER = process.env.VERIFICATION_DB_USER || 'admin';
const VERIFICATION_DB_NAME = process.env.VERIFICATION_DB_NAME || 'verification_db';
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === '--seller-email' && rawArgs[i + 1]) { opts.sellerEmail = rawArgs[i + 1]; i++; }
  if (rawArgs[i] === '--buyer-email' && rawArgs[i + 1]) { opts.buyerEmail = rawArgs[i + 1]; i++; }
}

async function httpPost(path, payload, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const url = `${gatewayUrl}${path}`;
  if (opts.dryRun) {
    console.log('[DRY-RUN] POST', url, payload);
    return { data: { data: { user: { id: 'dryrun-user' }, token: 'dryrun-token' } } };
  }
  const res = await axios.post(url, payload, { headers });
  return res.data;
}
async function httpGet(path, token) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const url = `${gatewayUrl}${path}`;
  if (opts.dryRun) {
    console.log('[DRY-RUN] GET', url);
    return { data: { token: 'dryrun-token' } };
  }
  const res = await axios.get(url, { headers });
  return res.data;
}

async function registerAndVerify(email, password, role = 'ev_owner') {
  try {
    // try login first
    const login = await httpPost('/api/users/login', { email, password });
    console.log('Login success for', email);
    return login.data;
  } catch (e) {
    // register
    try {
      console.log('Registering', email);
      const reg = await httpPost('/api/users/register', { email, password, role, full_name: `Seed ${role}`, phone: '+84900000001' });
      console.log('Registered', email);
    } catch (err) {
      console.warn('Register error (maybe exists):', err.response?.data || err.message);
    }
  }
  // fetch verification token dev-only
  try {
    const tokenResp = await httpGet('/api/users/internal/last-verification-token');
    const token = tokenResp.data?.token;
    if (token) {
      console.log('Found verification token, verifying', token);
      await httpGet(`/api/users/verify/${token}`);
    }
  } catch (err) {
    console.warn('No verification token or error fetching it:', err.response?.data || err.message);
  }
  // login
  const login2 = await httpPost('/api/users/login', { email, password });
  return login2.data;
}

async function createWalletAndMint(userId, amount = 100, token) {
  try {
    console.log('Create wallet for', userId);
    if (opts.forceDb) {
      // create wallet via DB
      const walletSql = `INSERT INTO wallet ("userId", balance) SELECT '${userId}', ${amount} WHERE NOT EXISTS (SELECT 1 FROM wallet WHERE "userId"='${userId}') RETURNING id;`;
      const walletOut = runPsql(CARBON_DB_CONTAINER, CARBON_DB_USER, CARBON_DB_NAME, walletSql, true);
      let walletId = parseIdFromPsql(walletOut);
      if (!walletId) {
        // wallet exists, fetch id
        const existing = runPsql(CARBON_DB_CONTAINER, CARBON_DB_USER, CARBON_DB_NAME, `SELECT id FROM wallet WHERE "userId"='${userId}' LIMIT 1`, true);
        walletId = parseIdFromPsql(existing);
      }
      // add credit transaction
      // Insert into TypeORM-created 'transaction' table. Use toWalletId for mint issuance
      runPsql(CARBON_DB_CONTAINER, CARBON_DB_USER, CARBON_DB_NAME, `INSERT INTO "transaction" ("toWalletId", type, amount) VALUES ('${walletId}', 'MINT', ${amount})`);
      console.log('Wallet and credit issuance added via DB for', userId);
      // When running in forceDb mode we used DB operations for both create and mint,
      // so return early to avoid trying the HTTP mint which would need an auth token.
      return;
    } else {
      await httpPost('/api/wallet/create', { userId }, token);
    }
  } catch (err) {
    console.warn('Create wallet error (may exist):', err.response?.data || err.message);
  }
  try {
    console.log('Mint', amount, 'credits to', userId);
    await httpPost('/api/wallet/mint', { userId, amount }, token);
  } catch (err) {
    console.warn('Mint error:', err.response?.data || err.message);
  }
}

async function createListing(sellerToken, sellerId, amount = 10, price = 5) {
  console.log('Creating listing for seller', sellerId);
  if (opts.forceDb) {
    // create listing via DB
    const sql = `INSERT INTO listing ("userId", amount, "pricePerCredit", status) SELECT '${sellerId}', ${amount}, ${price}, 'OPEN' WHERE NOT EXISTS (SELECT 1 FROM listing WHERE "userId"='${sellerId}' AND amount=${amount} AND "pricePerCredit"=${price} AND status='OPEN') RETURNING id;`;
    const out = runPsql(MARKETPLACE_DB_CONTAINER, MARKETPLACE_DB_USER, MARKETPLACE_DB_NAME, sql, true);
    const id = parseIdFromPsql(out);
    console.log('Inserted listing via DB for seller', sellerId, 'id:', id);
    return { id, output: out };
  }
  const res = await httpPost('/api/listings', { userId: sellerId, amount, pricePerCredit: price }, sellerToken);
  console.log('Created listing response:', res);
  return res;
}

async function createVehicle(sellerToken) {
  // create a reasonable demo EV vehicle for the seeded owner
  const demoVehicle = {
    make: 'Nexa',
    model: 'E-Trail',
    year: 2021,
    battery_capacity: 60, // kWh
    license_plate: 'SEED-EV-01',
    color: 'Blue',
  };

  try {
    console.log('Registering demo vehicle for seeded owner');
    const res = await httpPost('/api/vehicles', demoVehicle, sellerToken);
    console.log('Vehicle registered (seed):', res);
    return res;
  } catch (err) {
    console.warn('Vehicle seed error:', err.response?.data || err.message);
    return null;
  }
}

async function createVerification(userId, vehicleId) {
  if (opts.forceDb) {
    // create verification via DB
    const sql = `INSERT INTO verifications (user_id, vehicle_id, co2_amount, trips_count, status, emission_data, trip_details) VALUES ('${userId}', '${vehicleId}', 25.5, 10, 'pending', '{"co2_saved": 25.5}', '{"trips": 10}') RETURNING id;`;
    const out = runPsql(VERIFICATION_DB_CONTAINER, VERIFICATION_DB_USER, VERIFICATION_DB_NAME, sql, true);
    const id = parseIdFromPsql(out);
    console.log('Inserted verification via DB for user', userId, 'id:', id);
    return { id, output: out };
  }
  // If not forceDb, we could use HTTP, but for now, only DB mode
  console.log('Skipping verification creation (not in forceDb mode)');
}

async function run() {
  try {
    const sellerEmail = opts.sellerEmail || process.env.SELLER_EMAIL || 'seed-seller@example.com';
    const sellerPass = process.env.SELLER_PASSWORD || 'Testpass123!';
    const buyerEmail = opts.buyerEmail || process.env.BUYER_EMAIL || 'seed-buyer@example.com';
    const buyerPass = process.env.BUYER_PASSWORD || 'Testpass123!';

    const seller = await registerAndVerify(sellerEmail, sellerPass, 'ev_owner');
    const buyer = await registerAndVerify(buyerEmail, buyerPass, 'buyer');
    const admin = await registerAndVerify('admin@local.test', 'Admin123!', 'admin');
    console.log('Seller', seller.user.id, 'Buyer', buyer.user.id, 'Admin', admin.user.id);

    // Create wallets & mint credits (seller should have credits to sell) — provide auth tokens
    await createWalletAndMint(seller.user.id, 100, seller.token);
    await createWalletAndMint(buyer.user.id, 10, buyer.token);

    // Create a listing from seller
    const listing = await createListing(seller.token, seller.user.id, 10, 5);
    console.log('Listing created:', listing);

    // Also create a demo vehicle for the seeded seller so UI isn't empty
    const vehicle = await createVehicle(seller.token);
    if (vehicle && vehicle.data && vehicle.data.id) {
      // Create a pending verification for the vehicle
      await createVerification(seller.user.id, vehicle.data.id);
    }

    console.log('Seed completed.');
  } catch (err) {
    console.error('Seed error:', err.response?.data || err.message || err);
  }
}

run();
