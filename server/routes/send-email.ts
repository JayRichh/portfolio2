import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const router = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const RECIPIENT_EMAIL = 'web@jayrich.dev';
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const TOKEN_TTL_MS = 60 * 60 * 1000;
const MIN_FILL_TIME_MS = 1500;

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;'
};

let runtimeSecret = '';
function getSecret(): string {
  const fromEnv = process.env['FORM_TOKEN_SECRET'];
  if (fromEnv) return fromEnv;
  if (!runtimeSecret) runtimeSecret = randomBytes(32).toString('hex');
  return runtimeSecret;
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'hex');
  const bb = Buffer.from(b, 'hex');
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"'/]/g, ch => HTML_ENTITIES[ch] ?? ch);
}

function issueFormToken(): string {
  const issuedAt = Date.now();
  const nonce = randomBytes(8).toString('hex');
  const payload = `${issuedAt}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

function verifyFormToken(token: string | undefined): { valid: boolean; reason?: string } {
  if (!token) return { valid: false, reason: 'Missing token' };
  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false, reason: 'Malformed token' };
  const [issuedAtStr, nonce, signature] = parts;
  const payload = `${issuedAtStr}.${nonce}`;
  if (!safeEqual(sign(payload), signature)) return { valid: false, reason: 'Invalid signature' };
  const issuedAt = Number(issuedAtStr);
  if (!Number.isFinite(issuedAt)) return { valid: false, reason: 'Bad timestamp' };
  const age = Date.now() - issuedAt;
  if (age < MIN_FILL_TIME_MS) return { valid: false, reason: 'Submitted too quickly' };
  if (age > TOKEN_TTL_MS) return { valid: false, reason: 'Token expired' };
  return { valid: true };
}

router.get('/', (_req: Request, res: Response): void => {
  res.json({ formToken: issueFormToken() });
});

router.post('/', limiter, async (req: Request, res: Response): Promise<void> => {
  const { name, email, message, drawing, formToken, website } = req.body ?? {};

  if (typeof website === 'string' && website.trim().length > 0) {
    res.json({ success: true });
    return;
  }

  const tokenCheck = verifyFormToken(formToken);
  if (!tokenCheck.valid) {
    res.status(400).json({ error: tokenCheck.reason ?? 'Verification failed' });
    return;
  }

  const trimmedName = (name ?? '').trim();
  const trimmedEmail = (email ?? '').trim();
  const trimmedMessage = (message ?? '').trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  const apiKey = process.env['SMTP_API_KEY'];
  if (!apiKey) {
    res.status(500).json({ error: 'Email service not configured' });
    return;
  }

  const htmlBody = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(trimmedMessage).replace(/\n/g, '<br>')}</p>
    ${drawing ? '<p>Drawing attached below</p>' : ''}
  `;

  interface EmailPayload {
    api_key: string;
    to: string[];
    sender: string;
    subject: string;
    html_body: string;
    custom_headers: { header: string; value: string }[];
    attachments?: { filename: string; fileblob: string; mimetype: string }[];
  }

  const emailData: EmailPayload = {
    api_key: apiKey,
    to: [RECIPIENT_EMAIL],
    sender: RECIPIENT_EMAIL,
    subject: `New Contact Form Submission from ${trimmedName.slice(0, 80)}`,
    html_body: htmlBody,
    custom_headers: [{ header: 'Reply-To', value: trimmedEmail }]
  };

  if (drawing) {
    emailData.attachments = [{ filename: 'drawing.png', fileblob: drawing, mimetype: 'image/png' }];
  }

  try {
    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });
    if (!response.ok) throw new Error('Failed to send email');
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
