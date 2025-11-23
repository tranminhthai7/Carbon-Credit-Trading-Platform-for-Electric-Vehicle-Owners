import axios from 'axios';

const client = axios.create({
  baseURL: process.env.VERIFICATION_SERVICE_URL || 'http://verification-service:3004',
  timeout: 5000,
});

export async function submitVerification(payload: any) {
  return client.post('/credits/verify', payload);
}

export default { submitVerification };
