import { Router, Response, Request } from 'express';
import mongoose from 'mongoose';
import { Session, Message } from '../db/models/index.js';
import { authenticate, type AuthRequest } from '../middleware/auth.js';
import { validateBody, sessionSchema } from '../middleware/safety.js';
import { generateSessionId } from '../services/ids.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import { summarizeConversation } from '../services/summarize.js';
import { estimateTokens } from '../utils/tokens.js';
import { getDefaultProvider } from '../providers/index.js';

const router = Router();

// Shared messages handler (used by both routes)
export const getMessagesHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    // Support both query param and path param
    const sessionId = (req.query.sessionId as string) || (req.params.id as string);

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).json({ error: 'sessionId required' });
      return;
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      res.status(400).json({ error: 'Invalid sessionId format' });
      return;
    }

    // Verify session belongs to user
    const session = await Session.findById(sessionId);
    if (!session || session.userId !== userId) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const messages = await Message.find({ sessionId }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (error) {
    logger.error({ error }, 'Get messages error');
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

// GET /api/sessions
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const sessions = await Session.find({ userId, status: 'active' })
      .sort({ lastActivityAt: -1 })
      .limit(100);

    res.json(sessions);
  } catch (error) {
    logger.error({ error }, 'Get sessions error');
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

// POST /api/sessions
router.post(
  '/',
  authenticate,
  validateBody(sessionSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { title, systemPrompt } = req.body;

      const session = new Session({
        // Let Mongoose auto-generate ObjectId for _id
        userId,
        title: title || 'New Chat',
        systemPrompt,
        tokenBudget: {
          max: config.limits.tokenBudget.default,
          used: 0,
        },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });

      await session.save();
      res.status(201).json(session);
    } catch (error) {
      logger.error({ error, stack: error instanceof Error ? error.stack : undefined }, 'Create session error');
      if (error instanceof Error && error.message.includes('validation')) {
        res.status(400).json({ 
          error: 'Validation failed',
          message: error.message,
        });
        return;
      }
      res.status(500).json({ 
        error: 'Failed to create session',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// GET /api/sessions/messages?sessionId=...
// MUST be defined before /:id to avoid route collision
router.get('/messages', authenticate, getMessagesHandler);

// GET /api/sessions/:id/messages (alias)
router.get('/:id/messages', authenticate, getMessagesHandler);

// PATCH /api/sessions/:id  (update title/systemPrompt/temperature)
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const session = await Session.findById(req.params.id);

    if (!session || session.userId !== userId) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const { title, systemPrompt, temperature } = req.body || {};
    if (typeof title === 'string' && title.trim().length > 0) {
      session.title = title.trim();
    }
    if (typeof systemPrompt === 'string') {
      session.systemPrompt = systemPrompt;
    }
    if (typeof temperature === 'number') {
      session.temperature = Math.min(2, Math.max(0, temperature));
    }

    await session.save();
    res.json(session);
  } catch (error) {
    logger.error({ error }, 'Update session error');
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// GET /api/sessions/:id
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const session = await Session.findById(req.params.id);

    if (!session || session.userId !== userId) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    res.json(session);
  } catch (error) {
    logger.error({ error }, 'Get session error');
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// POST /api/sessions/:id/clear
router.post('/:id/clear', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const session = await Session.findById(req.params.id);

    if (!session || session.userId !== userId) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    // Delete all messages
    await Message.deleteMany({ sessionId: session._id });

    // Reset token budget
    session.tokenBudget.used = 0;
    session.summary = undefined;
    await session.save();

    res.json({ message: 'Session cleared', session });
  } catch (error) {
    logger.error({ error }, 'Clear session error');
    res.status(500).json({ error: 'Failed to clear session' });
  }
});

// POST /api/sessions/:id/summarize
router.post('/:id/summarize', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const session = await Session.findById(req.params.id);

    if (!session || session.userId !== userId) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    // Get messages
    const messages = await Message.find({ sessionId: session._id }).sort({ createdAt: 1 });
    const chatMessages = messages.map((m) => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    }));

    if (chatMessages.length === 0) {
      res.status(400).json({ error: 'No messages to summarize' });
      return;
    }

    // Get provider
    const provider = getDefaultProvider();

    // Summarize
    const summary = await summarizeConversation({
      provider,
      messages: chatMessages,
    });

    // Update session
    session.summary = summary;
    session.tokenBudget.used = estimateTokens(summary);

    // Delete old messages (keep last 5)
    const oldMessages = messages.slice(0, -5);
    if (oldMessages.length > 0) {
      await Message.deleteMany({ _id: { $in: oldMessages.map((m) => m._id) } });
    }

    await session.save();

    res.json({ summary, session });
  } catch (error) {
    logger.error({ error }, 'Summarize session error');
    res.status(500).json({ error: 'Failed to summarize session' });
  }
});

// GET /api/export/:id
router.get('/export/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const session = await Session.findById(req.params.id);

    if (!session || session.userId !== userId) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const messages = await Message.find({ sessionId: session._id }).sort({ createdAt: 1 });

    const exportData = {
      session: {
        id: session._id,
        title: session.title,
        createdAt: session.createdAt,
        summary: session.summary,
      },
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="session-${session._id}.json"`);
    res.json(exportData);
  } catch (error) {
    logger.error({ error }, 'Export session error');
    res.status(500).json({ error: 'Failed to export session' });
  }
});


export default router;

