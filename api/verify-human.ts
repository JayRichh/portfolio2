import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, randomUUID } from 'crypto';

const SECRET = process.env['SESSION_SECRET'] || randomUUID();
const SESSION_EXPIRY = 5 * 60 * 1000;

function createSession(answer: number): string {
  const data = JSON.stringify({ answer, timestamp: Date.now() });
  const signature = createHmac('sha256', SECRET).update(data).digest('hex');
  return Buffer.from(JSON.stringify({ data, signature })).toString('base64');
}

function verifySession(sessionId: string): { answer: number; timestamp: number } | null {
  try {
    const { data, signature } = JSON.parse(Buffer.from(sessionId, 'base64').toString());
    const expectedSig = createHmac('sha256', SECRET).update(data).digest('hex');
    if (signature !== expectedSig) return null;
    const session = JSON.parse(data);
    if (Date.now() - session.timestamp > SESSION_EXPIRY) return null;
    return session;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    const sessionId = createSession(answer);
    return res.status(200).json({ challenge: `${num1} + ${num2}`, sessionId });
  }

  if (req.method === 'POST') {
    const { userAnswer, sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    const session = verifySession(sessionId);
    if (!session) {
      return res.status(400).json({ error: 'Invalid or expired session' });
    }

    if (parseInt(userAnswer) !== session.answer) {
      return res.status(400).json({ error: 'Incorrect answer' });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
