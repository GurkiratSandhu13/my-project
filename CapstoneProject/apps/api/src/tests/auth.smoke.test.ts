import request from 'supertest';
import { createServer } from '../server.js';
import { connectMongo, disconnectMongo } from '../db/mongo.js';
import { User } from '../db/models/User.js';

describe('Auth Smoke Test', () => {
  let app: any;
  let server: any;

  beforeAll(async () => {
    await connectMongo();
    app = await createServer();
    server = app.listen(0);
  });

  afterAll(async () => {
    await server.close();
    await disconnectMongo();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('Register → Login → Me (with cookie)', async () => {
    const email = `test-${Date.now()}@example.com`;
    const password = 'testing123';

    // 1. Register
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ email, password })
      .expect(201);

    expect(registerRes.body.user).toBeDefined();
    expect(registerRes.body.user.email).toBe(email);
    expect(registerRes.body.token).toBeDefined();
    expect(registerRes.headers['set-cookie']).toBeDefined();

    // 2. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    expect(loginRes.body.user).toBeDefined();
    expect(loginRes.body.user.email).toBe(email);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.headers['set-cookie']).toBeDefined();

    // Extract cookie
    const cookies = loginRes.headers['set-cookie'];
    const tokenCookie = cookies.find((c: string) => c.startsWith('token='));
    expect(tokenCookie).toBeDefined();

    // 3. Get /me with cookie
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', tokenCookie!)
      .expect(200);

    expect(meRes.body.user).toBeDefined();
    expect(meRes.body.user.email).toBe(email);
  });

  test('Login with invalid credentials returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'wrong' })
      .expect(401);

    expect(res.body.error).toBe('Invalid credentials');
  });

  test('Email normalization works (lowercase)', async () => {
    const email = 'Test@Example.COM';
    const password = 'testing123';

    // Register with mixed case
    await request(app)
      .post('/api/auth/register')
      .send({ email, password })
      .expect(201);

    // Login with different case should work
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password })
      .expect(200);

    expect(res.body.user.email).toBe(email.toLowerCase());
  });
});

