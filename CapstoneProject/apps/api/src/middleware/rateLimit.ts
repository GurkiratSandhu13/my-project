import rateLimit from 'express-rate-limit';
import { config } from '../config.js';

// In-memory rate limit store (for production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = rateLimit({
  windowMs: config.limits.rateLimit.windowMs,
  max: config.limits.rateLimit.maxRequests,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  store: {
    incr: (key: string, cb: (err?: Error | null, total?: number, ttl?: number) => void) => {
      const now = Date.now();
      const record = rateLimitStore.get(key);

      if (!record || now > record.resetTime) {
        // New or expired record
        const resetTime = now + config.limits.rateLimit.windowMs;
        rateLimitStore.set(key, { count: 1, resetTime });
        cb(null, 1, resetTime - now);
      } else {
        // Increment existing record
        record.count++;
        rateLimitStore.set(key, record);
        cb(null, record.count, record.resetTime - now);
      }
    },
    resetAll: () => {
      rateLimitStore.clear();
    },
    resetKey: (key: string) => {
      rateLimitStore.delete(key);
    },
    decrement: (key: string) => {
      const record = rateLimitStore.get(key);
      if (record && record.count > 0) {
        record.count--;
      }
    },
    shutdown: () => {
      rateLimitStore.clear();
    },
  },
});

