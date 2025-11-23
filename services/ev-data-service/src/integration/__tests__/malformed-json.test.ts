import request from 'supertest';
import app from '../../app';

describe('Malformed JSON handling', () => {
  it('returns structured JSON error when request body is invalid JSON', async () => {
    // Send a raw invalid JSON payload as text with application/json content-type
    const invalid = "startTime: '2000-01-01T00:00:00Z'"; // invalid JSON (unquoted key / single quotes)

    const res = await request(app)
      .post('/api/vehicles/trips')
      .set('Content-Type', 'application/json')
      .send(invalid);

    expect(res.status).toBe(400);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Invalid JSON payload');
    expect(typeof res.body.error).toBe('string');
  });
});
