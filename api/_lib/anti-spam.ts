import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const TOKEN_TTL_MS = 60 * 60 * 1000;
const MIN_FILL_TIME_MS = 1500;

let cachedSecret = '';

function getSecret(): string {
  if (cachedSecret) return cachedSecret;
  const fromEnv = process.env['FORM_TOKEN_SECRET'];
  if (fromEnv) {
    cachedSecret = fromEnv;
    return cachedSecret;
  }
  const deploymentSha = process.env['VERCEL_GIT_COMMIT_SHA'];
  if (deploymentSha) {
    cachedSecret = createHmac('sha256', 'portfolio2-form').update(deploymentSha).digest('hex');
    return cachedSecret;
  }
  cachedSecret = randomBytes(32).toString('hex');
  return cachedSecret;
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

export function issueFormToken(): string {
  const issuedAt = Date.now();
  const nonce = randomBytes(8).toString('hex');
  const payload = `${issuedAt}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export interface VerifyResult {
  valid: boolean;
  reason?: string;
}

export function verifyFormToken(token: string | undefined): VerifyResult {
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

export function isHoneypotTriggered(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}
