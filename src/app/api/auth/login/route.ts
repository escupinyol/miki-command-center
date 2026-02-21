import { NextRequest, NextResponse } from 'next/server';
import { 
  getSession, 
  checkRateLimit, 
  recordFailedAttempt, 
  clearAttempts,
  verifyPassword,
  loginSchema 
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // Rate limiting
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const lockedUntil = rateLimit.lockedUntil || Date.now() + 3600000;
      const minutes = Math.ceil((lockedUntil - Date.now()) / 60000);
      
      return NextResponse.json(
        { error: `Demasiados intentos. Cuenta bloqueada por ${minutes} minutos.` },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((lockedUntil - Date.now()) / 1000)) } }
      );
    }

    // Parse y validación
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Datos inválidos', remaining: rateLimit.remaining },
        { status: 400 }
      );
    }

    const { password } = result.data;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminPasswordHash) {
      return NextResponse.json(
        { error: 'Configuración incompleta' },
        { status: 500 }
      );
    }

    // Verificación de contraseña
    const isValid = verifyPassword(password, adminPasswordHash);

    if (!isValid) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Contraseña incorrecta', remaining: rateLimit.remaining },
        { status: 401 }
      );
    }

    // Éxito - crear sesión
    clearAttempts(ip);
    const session = await getSession();
    session.isAuthenticated = true;
    await session.save();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  }
}
