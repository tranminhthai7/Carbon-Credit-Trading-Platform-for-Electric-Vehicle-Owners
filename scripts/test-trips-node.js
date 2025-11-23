(async () => {
  const gateway = process.env.GATEWAY_URL || 'http://localhost:8000';
  const stamp = Date.now();
  const email = `trips-node+${stamp}@example.com`;
  const pw = 'Testpass123!';
  console.log('Registering', email);
  try { await (await fetch(`${gateway}/api/users/register`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password: pw, role: 'ev_owner', full_name: 'Trips Node', phone: '+84900000004' }) })).text(); } catch(e) { console.warn('register may have failed', e.message) }
  // attempt verify token
  try {
    const tokenResp = await (await fetch(`${gateway}/api/users/internal/last-verification-token`)).json();
    const token = tokenResp?.data?.token;
    console.log('token:', token);
    if (token) await (await fetch(`${gateway}/api/users/verify/${token}`)).text();
  } catch(e) {
    console.warn('could not fetch/verify token', e.message)
  }

  // login
  const loginResp = await (await fetch(`${gateway}/api/users/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password: pw }) })).json();
  const token = loginResp?.data?.token;
  console.log('token', token);

  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  // create vehicle
  const vehiclePayload = { make: 'Nissan', model: 'Leaf', year: 2021, battery_capacity: 40, license_plate: 'NODE' + Math.floor(Math.random()*9000+1000), color: 'White' };
  const vehResp = await (await fetch(`${gateway}/api/vehicles`, { method: 'POST', headers, body: JSON.stringify(vehiclePayload) })).json();
  console.log('vehicleResp', vehResp?.data?._id);
  const vehicleId = vehResp?.data?._id;

  const tripPayload = {
    vehicleId,
    distance: 5.2,
    startTime: new Date(Date.now()-3600*1000).toISOString(),
    endTime: new Date().toISOString(),
    start_location: { latitude: 10.7758, longitude: 106.7004, address: 'Start address' },
    end_location: { latitude: 10.7767, longitude: 106.7021, address: 'End address' }
  };
  try {
    const r = await fetch(`${gateway}/api/vehicles/trips`, { method: 'POST', headers, body: JSON.stringify(tripPayload) });
    const text = await r.text();
    console.log('status', r.status); try { console.log('body', JSON.parse(text)) } catch(e) { console.log('raw', text)}
  } catch (e) {
    console.error('request failed', e.message);
  }
})();
