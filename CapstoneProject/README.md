# MERN AI Chatbot

A full-stack MERN application with AI chatbot capabilities, provider-agnostic backend, SSE streaming, session context management, and auto-summarization.

## Features

- **Provider-Agnostic Backend**: Support for Gemini (default), OpenAI, Dialogflow ES, and Mock provider
- **SSE Streaming**: Real-time streaming responses via Server-Sent Events
- **Session Management**: Context retention, token budgets, and auto-summarization
- **Security**: JWT authentication, rate limiting, input validation, safety guardrails
- **Modern UI**: React + TypeScript + Tailwind CSS with Zustand state management
- **Docker Support**: Complete Docker Compose setup for easy deployment

## Tech Stack

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS
- Zustand (state management)
- React Query (data fetching)
- React Router

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT authentication
- Pino logging
- Zod validation

### AI Providers
- Google Gemini (default)
- OpenAI
- Google Dialogflow ES
- Mock provider (for testing)

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose (optional)
- MongoDB (if not using Docker)

### 1. Clone and Install

```bash
cd my-project/CapstoneProject
pnpm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:
- `JWT_SECRET` (min 32 characters)
- `GEMINI_API_KEY` (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### 3. Start MongoDB

**Option A: Using Docker Compose (Recommended)**

```bash
cd docker
docker compose up -d mongo
```

Wait until mongo is healthy, then optionally start mongo-express UI:

```bash
docker compose --profile tools up -d mongo-express
# Access at http://localhost:8081 (admin/admin)
```

**Option B: Local MongoDB**

Ensure MongoDB is running locally on port 27017, or update `MONGO_URI` in `.env`.

### 4. Seed Database (Optional)

```bash
pnpm seed
```

Creates demo user:
- Email: `demo@example.com`
- Password: `demo123456`

### 5. Start Development Servers

```bash
# Start both API and Web
pnpm dev

# Or start individually:
pnpm --filter @apps/api dev  # API on http://localhost:4000
pnpm --filter @apps/web dev   # Web on http://localhost:5173
```

### 6. Access the Application

- **Web UI**: http://localhost:5173
- **API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health
- **Mongo Express** (if enabled): http://localhost:8081

## Docker Deployment

### Full Stack with Docker

```bash
cd docker
docker compose --profile docker up -d
```

This starts:
- MongoDB (port 27017)
- API (port 4000)
- Web (port 5173)
- Mongo Express (port 8081, optional)

### Environment Variables for Docker

Set environment variables in `.env` or pass them to `docker compose`:

```bash
GEMINI_API_KEY=your_key docker compose --profile docker up -d
```

## Configuration

### Provider Setup

#### Gemini (Default)

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env`: `GEMINI_API_KEY=your_key_here`
3. Restart API: `pnpm --filter @apps/api dev`

#### OpenAI (Optional)

1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env`: `OPENAI_API_KEY=your_key_here`
3. Restart API
4. In UI, select "OpenAI" provider

#### Dialogflow ES (Optional)

1. Create service account JSON at `/secrets/gcloud.json` (mounted in container)
2. Set in `.env`:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/secrets/gcloud.json
   DIALOGFLOW_PROJECT_ID=your_project_id
   DIALOGFLOW_LANGUAGE_CODE=en
   ```
3. Restart API

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Chat
- `POST /api/chat` - Non-streaming chat
- `POST /api/chat/stream` - SSE streaming chat

### Sessions
- `GET /api/sessions` - List sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions/:id` - Get session
- `POST /api/sessions/:id/clear` - Clear messages
- `POST /api/sessions/:id/summarize` - Summarize conversation
- `GET /api/sessions/messages?sessionId=...` - Get messages
- `GET /api/sessions/export/:id` - Export session as JSON

### Config & Metrics
- `GET /api/config` - Get available providers and limits
- `GET /api/metrics` - Get system metrics (latency, tokens, errors)

## Development

### Scripts

```bash
pnpm dev          # Start all services in dev mode
pnpm build        # Build all apps
pnpm start        # Start production servers
pnpm test         # Run tests
pnpm lint         # Lint code
pnpm format       # Format code
pnpm seed         # Seed database
```

### Project Structure

```
.
├── apps/
│   ├── api/              # Backend API
│   │   ├── src/
│   │   │   ├── middleware/   # Auth, CORS, rate limiting, safety
│   │   │   ├── routes/        # API routes
│   │   │   ├── providers/     # AI provider adapters
│   │   │   ├── services/      # Business logic
│   │   │   ├── db/            # MongoDB models
│   │   │   ├── utils/         # Utilities (SSE, logger, tokens)
│   │   │   └── tests/          # Tests
│   │   └── Dockerfile
│   └── web/              # Frontend React app
│       ├── src/
│       │   ├── components/    # React components
│       │   ├── pages/          # Page components
│       │   ├── lib/            # API client, store, utils
│       │   └── styles/         # Tailwind CSS
│       └── Dockerfile
├── docker/
│   └── docker-compose.yml
└── .env.example
```

## Testing

### Run Tests

```bash
# Backend tests
pnpm --filter @apps/api test

# Frontend tests
pnpm --filter @apps/web test

# All tests
pnpm test
```

### Mock Provider

The mock provider is available for testing and always enabled. It generates deterministic responses based on input messages.

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoDB connection failed`

1. Check MongoDB is running: `docker compose ps` or `mongosh`
2. Verify `MONGO_URI` in `.env` matches your setup
3. For Docker: ensure services are on the same network (`mern-network`)

### Provider Not Enabled

**Error**: `Provider X is not enabled`

1. Check `.env` has the required API key set
2. Verify key is valid (not empty, correct format)
3. Restart API after adding keys
4. Check API logs for initialization errors

### SSE Streaming Not Working

**Issue**: Messages not streaming in UI

1. Check browser console for errors
2. Verify `/api/chat/stream` endpoint returns SSE headers
3. Check network tab shows `text/event-stream` content type
4. Ensure CORS is configured correctly (`CLIENT_ORIGIN` in `.env`)

### Rate Limiting

**Error**: `429 Too many requests`

- Default: 100 requests per 15 minutes per IP/user
- Adjust in `config.ts` or environment variables
- For production, consider Redis-based rate limiting

### Authentication Issues

**Error**: `401 Authentication required`

1. Check JWT cookie is set (httpOnly, secure if production)
2. Verify `JWT_SECRET` is set and consistent
3. Clear cookies and re-login
4. Check token expiration (`JWT_EXPIRES`)

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

```bash
# Find process using port
lsof -i :4000  # API
lsof -i :5173  # Web
lsof -i :27017 # MongoDB

# Kill process or change PORT in .env
```

## Production Deployment

### Environment Variables

Set production values:
- `NODE_ENV=production`
- `COOKIE_SECURE=true` (requires HTTPS)
- `JWT_SECRET` (use strong random secret)
- `MONGO_URI` (production MongoDB connection string)

### Build

```bash
pnpm build
```

### Docker Production

```bash
cd docker
docker compose --profile docker up -d
```

### Security Checklist

- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Enable `COOKIE_SECURE=true` with HTTPS
- [ ] Set restrictive CORS (`CLIENT_ORIGIN`)
- [ ] Use production MongoDB with authentication
- [ ] Enable rate limiting (consider Redis)
- [ ] Set up monitoring and logging
- [ ] Keep dependencies updated

## License

MIT

## Support

For issues and questions:
1. Check the Troubleshooting section above
2. Review API logs: `pnpm --filter @apps/api dev`
3. Check browser console for frontend errors
4. Verify environment variables are set correctly


