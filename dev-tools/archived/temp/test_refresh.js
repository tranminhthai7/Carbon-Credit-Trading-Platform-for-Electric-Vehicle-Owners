const http = require('http');

function login(email, password) {
  const data = JSON.stringify({ email, password });
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      const setCookie = res.headers['set-cookie'];
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ headers: res.headers, body: JSON.parse(body), cookie: setCookie && setCookie[0] });
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function refresh(cookie) {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/refresh',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie
    }
  };
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    const email = 'nodeclient_1763352578903@example.com';
    const password = 'Aa123456!';
    const loginRes = await login(email, password);
    console.log('Login:', loginRes.status);
    console.log('Cookie header:', loginRes.cookie);
    const refreshRes = await refresh(loginRes.cookie);
    console.log('Refresh status:', refreshRes.status);
    console.log('Refresh body:', refreshRes.body);
  } catch (err) {
    console.error('Error:', err);
  }
})();
