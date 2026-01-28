import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';

const router = Router();

interface ChallengeSession {
  answer: number;
  timestamp: number;
}

const sessions = new Map<string, ChallengeSession>();
const SESSION_EXPIRY = 5 * 60 * 1000;

function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.timestamp > SESSION_EXPIRY) {
      sessions.delete(sessionId);
    }
  }
}

setInterval(cleanupExpiredSessions, 60 * 1000);

router.get('/', (req: Request, res: Response) => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const answer = num1 + num2;

  const sessionId = randomUUID();
  sessions.set(sessionId, { answer, timestamp: Date.now() });

  res.json({ challenge: `${num1} + ${num2}`, sessionId });
});

router.post('/', (req: Request, res: Response) => {
  const { userAnswer, sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  const session = sessions.get(sessionId);

  if (!session) {
    return res.status(400).json({ error: 'Invalid or expired session' });
  }

  if (Date.now() - session.timestamp > SESSION_EXPIRY) {
    sessions.delete(sessionId);
    return res.status(400).json({ error: 'Session expired' });
  }

  if (parseInt(userAnswer) !== session.answer) {
    return res.status(400).json({ error: 'Incorrect answer' });
  }

  sessions.delete(sessionId);
  res.json({ success: true });
});

export default router;
