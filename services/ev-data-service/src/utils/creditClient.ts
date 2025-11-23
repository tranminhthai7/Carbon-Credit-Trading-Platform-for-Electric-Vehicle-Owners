import axios from 'axios';

const client = axios.create({
  baseURL: process.env.CARBON_CREDIT_SERVICE_URL || 'http://carbon-credit-service:3003',
  timeout: 5000,
});

export async function submitCreditRequest(payload: any) {
  return client.post('/api/credits/request', payload);
}

export default { submitCreditRequest };
