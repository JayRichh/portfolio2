import type { VercelRequest, VercelResponse } from '@vercel/node';
import { escapeHtml } from './_lib/escape-html';
import { rateLimit, clientIp } from './_lib/rate-limit';
import { issueFormToken, verifyFormToken, isHoneypotTriggered } from './_lib/anti-spam';

const RECIPIENT_EMAIL = 'web@jayrich.dev';
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_NAME = 200;
const MAX_MESSAGE = 5000;
const RATE_LIMIT_PER_HOUR = 5;
const HOUR_MS = 60 * 60 * 1000;

interface SendEmailBody {
  name?: string;
  email?: string;
  message?: string;
  drawing?: string | null;
  formToken?: string;
  website?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({ formToken: issueFormToken() });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const ip = clientIp(req);
  if (!rateLimit(ip, RATE_LIMIT_PER_HOUR, HOUR_MS)) {
    return res.status(429).json({ error: 'Too many requests. Try again later.' });
  }

  const body = (req.body ?? {}) as SendEmailBody;

  if (isHoneypotTriggered(body.website)) {
    return res.status(200).json({ success: true });
  }

  const tokenCheck = verifyFormToken(body.formToken);
  if (!tokenCheck.valid) {
    return res.status(400).json({ error: tokenCheck.reason ?? 'Verification failed' });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const message = (body.message ?? '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (name.length > MAX_NAME || message.length > MAX_MESSAGE) {
    return res.status(400).json({ error: 'Field length exceeds maximum' });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const apiKey = process.env['SMTP_API_KEY'];
  if (!apiKey) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const htmlBody = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    ${body.drawing ? '<p>Drawing attached below</p>' : ''}
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
    subject: `New Contact Form Submission from ${name.slice(0, 80)}`,
    html_body: htmlBody,
    custom_headers: [{ header: 'Reply-To', value: email }]
  };

  if (body.drawing) {
    emailData.attachments = [{ filename: 'drawing.png', fileblob: body.drawing, mimetype: 'image/png' }];
  }

  try {
    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });
    if (!response.ok) throw new Error('Failed to send email');
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
