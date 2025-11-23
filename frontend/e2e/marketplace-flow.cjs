#!/usr/bin/env node
const axios = require('axios');
const fs = require('fs');

const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8000';
const frontendUrl = process.env.URL || 'http://localhost:5173';

async function registerAndVerify(email, password, role, full_name, phone) {
  try {
    // Try login first
    const login = await axios.post(`${gatewayUrl}/api/users/login`, { email, password });
    console.log('Login succeeded for', email);
    return login.data.data;
  } catch (e) {
    // Register
    try {
      console.log('Registering', email);
      await axios.post(`${gatewayUrl}/api/users/register`, { email, password, role, full_name, phone });
    } catch (err) {
      console.warn('Register may have failed or already exists:', err.message || err);
    }
  }

  // try to find verification token
  try {
    const tokenResp = await axios.get(`${gatewayUrl}/api/users/internal/last-verification-token`);
    const token = tokenResp.data?.data?.token;
    if (token) {
      console.log('Verifying via token', token);
      try {
        await axios.get(`${gatewayUrl}/api/users/verify/${token}`);
      } catch (err) {
        // If verification fails (e.g., token for other user), ignore and continue to login if possible
        console.warn('Verification failed (continuing to login):', err.response?.status || err.message);
      }
    }
  } catch (err) {
    console.warn('Could not fetch verification token:', err.message);
  }

  // Login now
  const login2 = await axios.post(`${gatewayUrl}/api/users/login`, { email, password });
  console.log('Login after register succeeded for', email);
  return login2.data.data;
}

async function createListing(token, userId, amount, pricePerCredit) {
  const res = await axios.post(`${gatewayUrl}/api/listings`, { userId, amount, pricePerCredit }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

async function createWalletForUser(userId) {
  try { const res = await axios.post(`${gatewayUrl}/api/wallet/create`, { userId }); return res.data; } catch (e) { return null; }
}

async function mintCreditsForUser(userId, amount) {
  try { const res = await axios.post(`${gatewayUrl}/api/wallet/mint`, { userId, amount }); return res.data; } catch (e) { return null; }
}

async function purchaseListing(token, listingId, buyerId) {
  // Use PATCH or POST buyer purchase route; marketplace service uses /listings/:id/purchase
  const res = await axios.post(`${gatewayUrl}/api/listings/${listingId}/purchase`, { buyerId }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

async function getListing(listingId) {
  const res = await axios.get(`${gatewayUrl}/api/listings/${listingId}`);
  return res.data;
}

async function getOrdersForUser(token) {
  const res = await axios.get(`${gatewayUrl}/api/orders`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

async function getWallet(userId) {
  const res = await axios.get(`${gatewayUrl}/api/wallet/${userId}`);
  return res.data;
}

async function mintCredits(token, userId, amount) {
  const res = await axios.post(`${gatewayUrl}/api/credits/wallet/mint`, { userId, amount }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

async function main() {
  try {
    console.log('Starting marketplace E2E flow...');

    // Setup users
    const stamp = Date.now();
    const sellerEmail = process.env.SELLER_EMAIL || `seller-e2e+${stamp}@example.com`;
    const sellerPass = process.env.SELLER_PASSWORD || 'Testpass123!';
    const buyerEmail = process.env.BUYER_EMAIL || `buyer-e2e+${stamp}@example.com`;
    const buyerPass = process.env.BUYER_PASSWORD || 'Testpass123!';

    const sellerData = await registerAndVerify(sellerEmail, sellerPass, 'ev_owner', 'Seller E2E', '+84900000001');
    const buyerData = await registerAndVerify(buyerEmail, buyerPass, 'buyer', 'Buyer E2E', '+84900000002');

    const sellerToken = sellerData.token;
    const buyerToken = buyerData.token;
    const sellerId = sellerData.user.id;
    const buyerId = buyerData.user.id;
    console.log('sellerId', sellerId, 'buyerId', buyerId);

    // Mint credits for seller
    console.log('Minting credits for seller');
    await mintCredits(sellerToken, sellerId, 100);

    // Optional: check initial wallets
    const sellerWalletBefore = await getWallet(sellerId)
      .catch(() => null);
    const buyerWalletBefore = await getWallet(buyerId)
      .catch(() => null);

    console.log('Seller wallet before:', sellerWalletBefore?.data);
    console.log('Buyer wallet before:', buyerWalletBefore?.data);

    // Create wallets & mint credits for seller (so seller can sell credits)
    await createWalletForUser(sellerId).catch(()=>null);
    await mintCreditsForUser(sellerId, 100).catch(()=>null);
    // Ensure buyer also has a wallet for transfer recipient to exist
    await createWalletForUser(buyerId).catch(()=>null);
    await mintCreditsForUser(buyerId, 10).catch(()=>null);

    // Create listing
    const amount = 10;
    const price = 5; // price per credit
    console.log('Creating listing...');
    const listing = await createListing(sellerToken, sellerId, amount, price);
    console.log('Created listing:', listing);
    const listingId = listing.id || listing[0]?.id || listing?.listing?.id;
    if (!listingId) throw new Error('Could not extract listing id from response');

    // Verify listing via GET
    // try fetch listing via gateway, if the service returns id-path mismatch, fallback to GET all
    const fetchedListing = await getListing(listingId).catch(async () => {
      const all = await axios.get(`${gatewayUrl}/api/listings`);
      return { data: all.data.find(l => l.id === listingId) };
    });
    console.log('Fetched listing after creation:', fetchedListing);

    // Purchase listing as buyer
    console.log('Purchasing listing');
    const buyResp = await purchaseListing(buyerToken, listingId, buyerId);
    console.log('Buy response:', buyResp);

    // Validate listing status changed
    const listingAfter = await getListing(listingId);
    console.log('Listing after purchase', listingAfter);
    const status = listingAfter?.status || listingAfter?.listing?.status;

    // Get orders via API
    const orders = await getOrdersForUser(buyerToken).catch(() => null);
    console.log('Orders for buyer (via /api/orders):', orders?.data || orders);

    // Check wallet balances
    const sellerWalletAfter = await getWallet(sellerId).catch(() => null);
    const buyerWalletAfter = await getWallet(buyerId).catch(() => null);

    console.log('Seller wallet after:', sellerWalletAfter?.data || sellerWalletAfter);
    console.log('Buyer wallet after:', buyerWalletAfter?.data || buyerWalletAfter);

    // Summarize
    const passed = status === 'SOLD' || status === 'COMPLETED' || (orders && (orders.data || orders).length > 0);
    const summary = {
      listingId,
      listingStatus: status,
      orders: orders?.data || orders,
      sellerWalletBefore: sellerWalletBefore?.data || sellerWalletBefore,
      sellerWalletAfter: sellerWalletAfter?.data || sellerWalletAfter,
      buyerWalletBefore: buyerWalletBefore?.data || buyerWalletBefore,
      buyerWalletAfter: buyerWalletAfter?.data || buyerWalletAfter,
      passed,
    };

    console.log('E2E summary:', JSON.stringify(summary, null, 2));
    fs.writeFileSync('./e2e/marketplace-flow-result.json', JSON.stringify(summary, null, 2));
    if (!passed) {
      console.error('Marketplace flow fails tests.');
      process.exit(2);
    }
    // Also try to detect if there were any error logs in the response objects
    process.exit(0);
  } catch (err) {
    console.error('Error in e2e flow:', err.message || err);
    process.exit(3);
  }
}

main();
