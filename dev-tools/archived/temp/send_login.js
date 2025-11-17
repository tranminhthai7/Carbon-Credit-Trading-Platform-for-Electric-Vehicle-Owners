const http = require('http');
const data = JSON.stringify({ email: 'nodeclient_1763352578903@example.com', password: 'Aa123456!' });

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

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', JSON.stringify(res.headers));
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('BODY:', body);
  });
});

req.on('error', (e) => {
  console.error('problem with request:', e.message);
});

req.write(data);
req.end();
