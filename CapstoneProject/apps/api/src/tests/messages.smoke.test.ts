import request from 'supertest';
import { createServer } from '../server.js';
import { connectMongo, disconnectMongo } from '../db/mongo.js';
import { User, Session, Message } from '../db/models/index.js';
import bcrypt from 'bcryptjs';

describe('Messages Smoke Test', () => {
  let app: any;
  let server: any;
  let authCookie: string;
  let userId: string;

  beforeAll(async () => {
    await connectMongo();
    app = await createServer();
    server = app.listen(0);

    // Create test user and login to get auth cookie
    const email = `test-${Date.now()}@example.com`;
    const password = 'testing123';
    const hash = await bcrypt.hash(password, 10);
    
    const user = new User({
      email,
      hash,
      role: 'user',
    });
    await user.save();
    userId = user._id.toString();

    // Login to get cookie
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    const cookies = loginRes.headers['set-cookie'];
    authCookie = cookies.find((c: string) => c.startsWith('token=')) || '';
  });

  afterAll(async () => {
    await server.close();
    await disconnectMongo();
  });

  beforeEach(async () => {
    await Session.deleteMany({});
    await Message.deleteMany({});
  });

  test('Login → Create Session → POST /api/chat (mock provider) → GET /api/sessions/messages → 200 with messages', async () => {
    // 1. Create session
    const sessionRes = await request(app)
      .post('/api/sessions')
      .set('Cookie', authCookie)
      .send({})
      .expect(201);

    const sessionId = sessionRes.body._id;
    expect(sessionId).toBeDefined();

    // 2. Send message via POST /api/chat (non-stream with mock provider)
    const chatRes = await request(app)
      .post('/api/chat')
      .set('Cookie', authCookie)
      .send({
        sessionId,
        content: 'Hi, this is a test message',
        provider: 'mock', // Use mock provider for testing
      })
      .expect(200);

    expect(chatRes.body).toBeDefined();
    expect(chatRes.body.message).toBeDefined();

    // 3. Fetch messages via GET /api/sessions/messages?sessionId=...
    const messagesRes = await request(app)
      .get(`/api/sessions/messages?sessionId=${sessionId}`)
      .set('Cookie', authCookie)
      .expect(200);

    expect(messagesRes.body).toBeDefined();
    expect(messagesRes.body.messages).toBeDefined();
    expect(Array.isArray(messagesRes.body.messages)).toBe(true);
    expect(messagesRes.body.messages.length).toBeGreaterThanOrEqual(2); // At least user + assistant message

    // Verify message structure
    const messages = messagesRes.body.messages;
    const userMessage = messages.find((m: any) => m.role === 'user');
    const assistantMessage = messages.find((m: any) => m.role === 'assistant');

    expect(userMessage).toBeDefined();
    expect(userMessage.content).toBe('Hi, this is a test message');
    expect(assistantMessage).toBeDefined();
    expect(assistantMessage.content).toBeDefined();
    expect(assistantMessage.content.length).toBeGreaterThan(0);
  });

  test('GET /api/sessions/:id/messages (alias route) works', async () => {
    // Create session
    const sessionRes = await request(app)
      .post('/api/sessions')
      .set('Cookie', authCookie)
      .send({})
      .expect(201);

    const sessionId = sessionRes.body._id;

    // Send a message
    await request(app)
      .post('/api/chat')
      .set('Cookie', authCookie)
      .send({
        sessionId,
        content: 'Test message',
        provider: 'mock',
      })
      .expect(200);

    // Fetch via alias route
    const messagesRes = await request(app)
      .get(`/api/sessions/${sessionId}/messages`)
      .set('Cookie', authCookie)
      .expect(200);

    expect(messagesRes.body.messages).toBeDefined();
    expect(Array.isArray(messagesRes.body.messages)).toBe(true);
  });

  test('GET /api/sessions/messages validates sessionId format', async () => {
    // Test with invalid sessionId format
    const invalidRes = await request(app)
      .get('/api/sessions/messages?sessionId=invalid-id')
      .set('Cookie', authCookie)
      .expect(400);

    expect(invalidRes.body.error).toBe('Invalid sessionId format');
  });

  test('GET /api/sessions/messages returns 404 for non-existent session', async () => {
    // Use a valid ObjectId format but non-existent session
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app)
      .get(`/api/sessions/messages?sessionId=${fakeId}`)
      .set('Cookie', authCookie)
      .expect(404);

    expect(res.body.error).toBe('Session not found');
  });

  test('GET /api/sessions/messages requires sessionId parameter', async () => {
    const res = await request(app)
      .get('/api/sessions/messages')
      .set('Cookie', authCookie)
      .expect(400);

    expect(res.body.error).toBe('sessionId required');
  });

  test('GET /api/sessions/messages requires authentication', async () => {
    const res = await request(app)
      .get('/api/sessions/messages?sessionId=507f1f77bcf86cd799439011')
      .expect(401);

    expect(res.body.error).toBe('Authentication required');
  });

  test('POST /api/chat returns 400 with PROVIDER_NOT_CONFIGURED code for missing provider', async () => {
    const sessionRes = await request(app)
      .post('/api/sessions')
      .set('Cookie', authCookie)
      .send({})
      .expect(201);

    const sessionId = sessionRes.body._id;

    // Try with a non-existent provider
    const res = await request(app)
      .post('/api/chat')
      .set('Cookie', authCookie)
      .send({
        sessionId,
        content: 'Test',
        provider: 'nonexistent',
      })
      .expect(400);

    expect(res.body.code).toBe('PROVIDER_NOT_CONFIGURED');
    expect(res.body.provider).toBeDefined();
  });
});

