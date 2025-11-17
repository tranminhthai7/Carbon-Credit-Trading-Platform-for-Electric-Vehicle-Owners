const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

// Simple login endpoint
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body || {};
  // For quick testing, accept any password and return a mock token
  const user = {
    id: 'user-123',
    email: email || 'test@example.com',
    full_name: 'Test User',
    role: 'buyer',
  };
  const token = 'mock-jwt-token-abc123';
  return res.json({ success: true, message: 'Login successful', data: { user, token } });
});

app.get('/api/users/profile', (req, res) => {
  const user = {
    id: 'user-123',
    email: 'test@example.com',
    full_name: 'Test User',
    role: 'buyer',
  };
  return res.json(user);
});

app.post('/api/users/register', (req, res) => {
  const { email } = req.body || {};
  const user = {
    id: 'user-123',
    email: email || 'test@example.com',
    full_name: 'Registered Test',
    role: 'buyer',
  };
  const token = 'mock-jwt-token-abc123';
  return res.json({ success: true, message: 'Registered', data: { user, token } });
});

app.get('/health', (req, res) => res.status(200).send('ok'));

app.listen(port, () => {
  console.log(`Mock Auth server listening on port ${port}`);
});
