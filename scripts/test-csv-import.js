(async () => {
  const gateway = process.env.GATEWAY_URL || 'http://localhost:8000';
  const stamp = Date.now();
  const email = `csv-import+${stamp}@example.com`;
  const pw = 'Testpass123!';
  console.log('Testing CSV Import for', email);

  try {
    // Register user
    console.log('Registering user...');
    await (await fetch(`${gateway}/api/users/register`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        email,
        password: pw,
        role: 'ev_owner',
        full_name: 'CSV Import Test',
        phone: '+84900000005'
      })
    })).text();

    // Get verification token and verify
    console.log('Verifying user...');
    try {
      const tokenResp = await (await fetch(`${gateway}/api/users/internal/last-verification-token`)).json();
      const token = tokenResp?.data?.token;
      if (token) {
        await (await fetch(`${gateway}/api/users/verify/${token}`)).text();
      }
    } catch(e) {
      console.warn('Could not verify token', e.message);
    }

    // Login
    console.log('Logging in...');
    const loginResp = await (await fetch(`${gateway}/api/users/login`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password: pw })
    })).json();
    console.log('Login response:', JSON.stringify(loginResp, null, 2));
    const token = loginResp?.data?.token;
    console.log('Login successful, token:', token ? 'received' : 'failed');

    if (!token) {
      console.error('No token received, exiting');
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    // Create vehicle
    console.log('Creating vehicle...');
    const vehiclePayload = {
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      battery_capacity: 75,
      // license_plate: 'CSV' + Date.now().toString().slice(-6), // Temporarily disabled
      color: 'Blue'
    };
    console.log('Vehicle payload:', JSON.stringify(vehiclePayload, null, 2));
    const vehResp = await (await fetch(`${gateway}/api/vehicles`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(vehiclePayload)
    })).json();
    console.log('Vehicle response:', JSON.stringify(vehResp, null, 2));
    const vehicleId = vehResp?.data?._id;
    console.log('Vehicle created:', vehicleId);

    if (!vehicleId) {
      console.error('No vehicle ID received, exiting');
      return;
    }

    // Test CSV import
    console.log('Testing CSV import...');
    const fs = require('fs');
    const path = require('path');

    const csvPath = path.join(__dirname, '..', 'postman', 'sample-trips.csv');
    console.log('CSV file path:', csvPath);

    if (!fs.existsSync(csvPath)) {
      console.error('CSV file not found at:', csvPath);
      return;
    }

    const csvData = fs.readFileSync(csvPath);
    console.log('CSV file size:', csvData.length, 'bytes');

    // Create FormData for file upload
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream(csvPath), {
      filename: 'sample-trips.csv',
      contentType: 'text/csv'
    });

    // Add idempotency key
    form.append('idempotencyKey', `csv-import-${stamp}`);

    console.log('Uploading CSV...');
    // Manually create headers including form boundary
    const formHeaders = form.getHeaders();
    const importResp = await fetch(`${gateway}/api/vehicles/${vehicleId}/trips/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formHeaders
      },
      body: form
    });

    const responseText = await importResp.text();
    console.log('Import response status:', importResp.status);
    try {
      const responseJson = JSON.parse(responseText);
      console.log('Import response:', JSON.stringify(responseJson, null, 2));
    } catch(e) {
      console.log('Import response (raw):', responseText);
    }

    // Check if trips were created
    console.log('Checking created trips...');
    const tripsResp = await fetch(`${gateway}/api/vehicles/${vehicleId}/trips`, {
      method: 'GET',
      headers: { ...headers, 'Content-Type': 'application/json' }
    });

    const tripsText = await tripsResp.text();
    console.log('Trips response status:', tripsResp.status);
    try {
      const tripsJson = JSON.parse(tripsText);
      console.log('Trips found:', tripsJson?.data?.length || 0);
      if (tripsJson?.data?.length > 0) {
        console.log('Sample trip:', JSON.stringify(tripsJson.data[0], null, 2));
      }
    } catch(e) {
      console.log('Trips response (raw):', tripsText);
    }

  } catch (e) {
    console.error('Test failed:', e.message);
    console.error(e.stack);
  }
})();