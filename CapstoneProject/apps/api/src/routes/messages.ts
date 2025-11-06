import { Router, Response } from 'express';
import { authenticate, type AuthRequest } from '../middleware/auth.js';
import { getMessagesHandler } from './sessions.js';

const router = Router();

// Canonical alias: GET /api/messages?sessionId=...
router.get('/', authenticate, (req: AuthRequest, res: Response) => getMessagesHandler(req, res));

export default router;