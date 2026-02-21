import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { z } from 'zod';

const sessionConfig = {
  cookieName: 'miki_session',
  password: process.env.SESSION_SECRET || 'default_secret_change_this_in_production_32chars!',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 días
  },
};

export interface SessionData {
  isAuthenticated: boolean;
  loginAttempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionConfig);
}

// Rate limiting en memoria (para serverless es suficiente)
const loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutos
const LOCKOUT_DURATION = 60 * 60 * 1000; // 1 hora

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; lockedUntil?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  // Si está bloqueado
  if (record.lockedUntil && now < record.lockedUntil) {
    return { allowed: false, remaining: 0, lockedUntil: record.lockedUntil };
  }

  // Reset si pasó la ventana
  if (now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  // Verificar si debe bloquearse
  if (record.count >= RATE_LIMIT_MAX) {
    const lockedUntil = now + LOCKOUT_DURATION;
    record.lockedUntil = lockedUntil;
    return { allowed: false, remaining: 0, lockedUntil };
  }

  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count - 1 };
}

export function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  
  if (!record) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
  } else {
    record.count++;
    record.lastAttempt = now;
  }
}

export function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

// Hash de contraseña seguro (PBKDF2)
export function hashPassword(password: string): string {
  const salt = randomBytes(32).toString('hex');
  const hash = createHash('sha256')
    .update(password + salt + process.env.SESSION_SECRET)
    .digest('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashed: string): boolean {
  const [salt, hash] = hashed.split(':');
  if (!salt || !hash) return false;
  
  const computed = createHash('sha256')
    .update(password + salt + process.env.SESSION_SECRET)
    .digest('hex');
  
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(computed));
  } catch {
    return false;
  }
}

// Validación de input
export const loginSchema = z.object({
  password: z.string().min(1).max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;
