#!/usr/bin/env node
const axios = require('axios');

const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8000';
// CLI flags
const rawArgs = process.argv.slice(2);
const opts = {
  dryRun: rawArgs.includes('--dry-run'),
  forceDb: rawArgs.includes('--force-db'),
  yes: rawArgs.includes('--yes') || rawArgs.includes('-y'),
  emails: [],
};
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === '--emails' && rawArgs[i + 1]) {
    opts.emails = rawArgs[i + 1].split(',').map(s => s.trim());
    i++;
  }
}

async function httpPost(path, payload, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await axios.post(`${gatewayUrl}${path}`, payload, { headers });
  return res.data;
}
async function httpDelete(path, token) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await axios.delete(`${gatewayUrl}${path}`, { headers });
  return res.data;
}
async function httpGet(path, token) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await axios.get(`${gatewayUrl}${path}`, { headers });
  return res.data;
}

async function getUserByEmail(email) {
  // If user-service exposes an admin endpoint to list users - else rely on login
  try {
    const res = await axios.post(`${gatewayUrl}/api/users/login`, { email, password: 'Testpass123!' });
    return res.data.data.user;
  } catch (err) {
    return null;
  }
}

async function deleteListingByUser(userId, token) {
  try {
    if (opts.forceDb) {
      console.log('Force-DB set - skipping API listing delete for user', userId);
      return;
    }
    const listings = await httpGet(`/api/listings`, token);
    if (!listings || !listings.length) return;
    for (const l of listings) {
      if (l.userId === userId) {
        // cancel/delete if API supports it
        try {
          console.log('Attempting delete listing via API for listing', l.id);
          if (opts.dryRun) {
            console.log('[DRY-RUN] Would delete listing via API', l.id);
          } else {
            await axios.delete(`${gatewayUrl}/api/listings/${l.id}`, { headers: { Authorization: `Bearer ${token}` } });
            console.log('Deleted listing via API', l.id);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  } catch (err) {
    // ignore
  }
}

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

function escapeSqlLiteral(s) { return ('' + s).replace(/'/g, "''"); }

const MARKETPLACE_DB_CONTAINER = process.env.MARKETPLACE_DB_CONTAINER || 'marketplace-db';
const MARKETPLACE_DB_USER = process.env.MARKETPLACE_DB_USER || 'admin';
const MARKETPLACE_DB_NAME = process.env.MARKETPLACE_DB_NAME || 'marketplace_db';
const CARBON_DB_CONTAINER = process.env.CARBON_DB_CONTAINER || 'carbon-db';
const CARBON_DB_USER = process.env.CARBON_DB_USER || 'admin';
const CARBON_DB_NAME = process.env.CARBON_DB_NAME || 'carbon_credit_db';
const USER_DB_CONTAINER = process.env.USER_DB_CONTAINER || 'user-db';
const USER_DB_USER = process.env.USER_DB_USER || 'admin';
const USER_DB_NAME = process.env.USER_DB_NAME || 'user_service_db';

function runPsql(container, dbUser, dbName, sql, captureOutput = false) {
  sql = sql.replace(/"/g, '\\"');
  const flags = captureOutput ? '-t -A' : '';
  const cmd = `docker exec -i ${container} psql -U ${dbUser} -d ${dbName} ${flags} -c "${sql}"`;
  console.log('Preparing to run psql on', container, dbName, ':', sql.replace(/\n/g, ' ').substr(0, 150));
  if (opts.dryRun) {
    console.log('[DRY-RUN] psql command:', cmd);
    return null;
  }
  const out = child_exec_sync(cmd, captureOutput);
  if (captureOutput && out) {
    console.log('psql output:', out);
  }
  return out;
}

async function cleanupUser(email) {
  try {
    const user = await getUserByEmail(email);
    let dbUserId;
    if (!user) {
      console.log('No user from login API for', email, '- trying DB lookup');
      // try to find user id via user DB
      const uid = runPsql(USER_DB_CONTAINER, USER_DB_USER, USER_DB_NAME, `SELECT id FROM users WHERE email='${escapeSqlLiteral(email)}'`, true);
      if (!uid) {
        console.log('No user id found in DB for', email);
        return;
      }
      // psql output may include newline; capture it
      const userIdFromDb = (uid || '').split('\n').pop().trim();
      if (!userIdFromDb) {
        console.log('No user id returned in DB lookup for', email);
        return;
      }
      console.log('Found user id via DB lookup', userIdFromDb);
      // create a fake user object with id and set later
      // we will attempt direct DB cleanup via this id
      // login may not be possible; set token to null
      dbUserId = userIdFromDb;
    }
    let token = null;
    let userId = null;
    try {
      if (opts.forceDb) throw new Error('force-db');
      const loginResp = await axios.post(`${gatewayUrl}/api/users/login`, { email, password: 'Testpass123!' });
      token = loginResp.data.data.token;
      userId = loginResp.data.data.user.id;
    } catch (errLogin) {
      // allowed to proceed with DB lookup
      if (typeof dbUserId !== 'undefined') {
        userId = dbUserId;
        console.log('Proceeding with DB user id', userId, 'without API token');
      } else {
        if (opts.forceDb) {
          // find user id via DB when force-db and API login failed
          const uid = runPsql(USER_DB_CONTAINER, USER_DB_USER, USER_DB_NAME, `SELECT id FROM users WHERE email='${escapeSqlLiteral(email)}'`, true);
          const userIdFromDb = (uid || '').split('\n').pop().trim();
          userId = userIdFromDb;
          if (!userId) throw errLogin;
          console.log('Found user id via DB lookup', userId, 'in force-db flow');
        } else {
          throw errLogin; // rethrow if we didn't find a dbUserId
        }
      }
    }

    // delete listings by this user
    await deleteListingByUser(userId, token);

    // delete user - if admin route available
    try {
      if (opts.dryRun) {
        console.log('[DRY-RUN] Would call admin API to delete user', userId);
      } else {
        await axios.delete(`${gatewayUrl}/api/users/admin/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (err) {
      console.warn('No admin endpoint to delete user via API; will attempt direct DB cleanup', userId);
      // Direct DB cleanup fallback (use psql to delete user and related rows)
        try {
          const uid = escapeSqlLiteral(userId);
        // Remove listings by this user
          // try plural and singular variants for robustness
          runPsql(MARKETPLACE_DB_CONTAINER, MARKETPLACE_DB_USER, MARKETPLACE_DB_NAME, `DELETE FROM listings WHERE seller_id='${uid}'`);
          runPsql(MARKETPLACE_DB_CONTAINER, MARKETPLACE_DB_USER, MARKETPLACE_DB_NAME, `DELETE FROM listing WHERE userid='${uid}'`);
          runPsql(MARKETPLACE_DB_CONTAINER, MARKETPLACE_DB_USER, MARKETPLACE_DB_NAME, `DELETE FROM orders WHERE buyer_id='${uid}' OR seller_id='${uid}'`);
          runPsql(MARKETPLACE_DB_CONTAINER, MARKETPLACE_DB_USER, MARKETPLACE_DB_NAME, `DELETE FROM \"order\" WHERE buyerid='${uid}' OR sellerid='${uid}'`);

          // Remove wallet transactions and wallets
          // carbon db: plural and singular variants
          runPsql(CARBON_DB_CONTAINER, CARBON_DB_USER, CARBON_DB_NAME, `DELETE FROM credit_transactions WHERE wallet_id IN (SELECT id FROM wallets WHERE user_id='${uid}')`);
          runPsql(CARBON_DB_CONTAINER, CARBON_DB_USER, CARBON_DB_NAME, `DELETE FROM wallet_transaction WHERE wallet_id IN (SELECT id FROM wallet WHERE userid='${uid}')`);
          runPsql(CARBON_DB_CONTAINER, CARBON_DB_USER, CARBON_DB_NAME, `DELETE FROM wallets WHERE user_id='${uid}'`);
          runPsql(CARBON_DB_CONTAINER, CARBON_DB_USER, CARBON_DB_NAME, `DELETE FROM wallet WHERE userid='${uid}'`);
          runPsql(CARBON_DB_CONTAINER, CARBON_DB_USER, CARBON_DB_NAME, `DELETE FROM carbon_credit WHERE minted_by='${uid}' OR owner_id='${uid}'`);

          // Remove from user db (children first)
          runPsql(USER_DB_CONTAINER, USER_DB_USER, USER_DB_NAME, `DELETE FROM email_verifications WHERE user_id='${uid}'`);
          runPsql(USER_DB_CONTAINER, USER_DB_USER, USER_DB_NAME, `DELETE FROM refresh_tokens WHERE user_id='${uid}'`);
          runPsql(USER_DB_CONTAINER, USER_DB_USER, USER_DB_NAME, `DELETE FROM users WHERE id='${uid}'`);
        console.log('Direct DB cleanup executed for user', userId);
      } catch (err2) {
        console.error('Direct DB cleanup failed for user', userId, err2.message || err2);
      }
    }

    console.log('Cleaned up user', email);
  } catch (err) {
    console.error('Cleanup fail for', email, err.response?.data || err.message || err);
  }
}

async function run() {
  try {
    console.log('Cleaning up seeded users...');
    const sellerEmail = process.env.SELLER_EMAIL || 'seed-seller@example.com';
    const buyerEmail = process.env.BUYER_EMAIL || 'seed-buyer@example.com';
    const defaultEmails = [sellerEmail, buyerEmail];
    const emails = (opts.emails && opts.emails.length) ? opts.emails : defaultEmails;

    if (!opts.yes) {
      const readline = require('readline');
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const answer = await new Promise(resolve => rl.question(`Proceed to cleanup the following emails: ${emails.join(', ')}? (yes/no): `, a => { rl.close(); resolve(a); }));
      if (!/^(y|yes)$/i.test(answer)) {
        console.log('Aborting cleanup');
        return;
      }
    } else {
      console.log('--yes supplied; proceeding without confirmation');
    }

    for (const e of emails) {
      await cleanupUser(e);
    }

    console.log('Cleanup finished.');
  } catch (err) {
    console.error('Cleanup error', err);
    process.exitCode = 1;
  }
}

run();
