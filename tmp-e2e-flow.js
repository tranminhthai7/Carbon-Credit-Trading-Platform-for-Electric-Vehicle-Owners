const http = require('http');
const hostname = 'localhost';
const gatewayPort = 8000;

function httpRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', (e) => reject(e));
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  try {
    const ts = Date.now();
    const email = `e2e-js-${ts}@example.com`;
    const raw = JSON.stringify({ email, password: 'TestPassword1!', role: 'ev_owner', full_name: 'E2E JS Tester', phone: '0123456789' });

    console.log('Registering user:', email);
    let resp = await httpRequest({ hostname, port: gatewayPort, path: '/api/users/register', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(raw) } }, raw);
    console.log('Register:', resp.status, resp.body);

    // Get last verification token (dev-only)
    resp = await httpRequest({ hostname, port: gatewayPort, path: '/api/users/internal/last-verification-token', method: 'GET' });
    console.log('Last verification token response:', resp.status, resp.body);
    const tokenData = JSON.parse(resp.body);
    const token = tokenData?.data?.token || (tokenData?.token);
    console.log('Token:', token);

    // Verify user
    if (token) {
      resp = await httpRequest({ hostname, port: gatewayPort, path: `/api/users/verify/${token}`, method: 'GET' });
      console.log('Verify:', resp.status, resp.body);
    }

    // Login
    const loginRaw = JSON.stringify({ email, password: 'TestPassword1!' });
    resp = await httpRequest({ hostname, port: gatewayPort, path: '/api/users/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginRaw) } }, loginRaw);
    console.log('Login:', resp.status, resp.body);

    if (resp.status === 200) {
      const loginData = JSON.parse(resp.body);
      const token = loginData?.data?.token;
      const user = loginData?.data?.user;
      console.log('Login token:', token);
      if (token && user?.id) {
        // Call personal stats endpoint with token
        resp = await httpRequest({ hostname, port: gatewayPort, path: `/api/reports/personal/${user.id}`, method: 'GET', headers: { Authorization: `Bearer ${token}` } });
        console.log('Get personal stats:', resp.status, resp.body);
      }
    }
  } catch (e) {
    console.error('Error', e);
  }
})();
