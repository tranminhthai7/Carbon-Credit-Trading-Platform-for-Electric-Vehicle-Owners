const axios = require('axios');

(async()=>{
  try{
    const gateway='http://localhost:8000';
    const seller='seller-debug@example.com';
    const buyer='buyer-debug@example.com';
    const pass='Testpass123!';

    // register (ignore errors)
    await axios.post(`${gateway}/api/users/register`,{ email: seller, password: pass, role: 'ev_owner', full_name: 'Seller', phone: '+84900000001' }).catch(()=>{});
    await axios.post(`${gateway}/api/users/register`,{ email: buyer, password: pass, role: 'buyer', full_name: 'Buyer', phone: '+84900000002' }).catch(()=>{});

    const sellerLogin=(await axios.post(`${gateway}/api/users/login`,{ email: seller, password: pass })).data.data;
    const buyerLogin=(await axios.post(`${gateway}/api/users/login`,{ email: buyer, password: pass })).data.data;
    console.log('tokens', sellerLogin.token?.length, buyerLogin.token?.length);

    const sellerId=sellerLogin.user.id;
    const buyerId=buyerLogin.user.id;

    await axios.post(`${gateway}/api/wallet/create`, { userId: sellerId }).catch(()=>{});
    await axios.post(`${gateway}/api/wallet/mint`, { userId: sellerId, amount: 100 }).catch(()=>{});

    const res=(await axios.post(`${gateway}/api/listings`, { userId: sellerId, amount: 10, pricePerCredit: 5 }, { headers: { Authorization: 'Bearer ' + sellerLogin.token } })).data;
    console.log('listing', res);
    const listingId = res.id || res[0]?.id;

    try{
      const buy=(await axios.post(`${gateway}/api/listings/${listingId}/purchase`, { buyerId }, { headers: { Authorization: 'Bearer ' + buyerLogin.token } })).data;
      console.log('buy success', buy);
    }catch(e){
      console.error('buy err', e.response?.data || e.message);
    }
  }catch(e){
    console.error('fatal', e.response?.data || e.message || e);
  }
})();
