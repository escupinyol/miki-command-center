import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const sessionConfig = {
  cookieName: 'miki_session',
  password: process.env.SESSION_SECRET || 'default_secret_change_this_in_production_32chars!',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
    maxAge: 60 * 60 * 24 * 7,
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

// Rate limiting
const loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const LOCKOUT_DURATION = 60 * 60 * 1000;

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; lockedUntil?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.lockedUntil && now < record.lockedUntil) {
    return { allowed: false, remaining: 0, lockedUntil: record.lockedUntil };
  }

  if (now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

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

// Verificación de contraseña usando bcrypt
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    return false;
  }
}

// Generar hash (solo para setup inicial)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Validación
export const loginSchema = z.object({
  password: z.string().min(1).max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;
