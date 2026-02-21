import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Config de sesión (debe coincidir con lib/auth.ts)
const COOKIE_NAME = 'miki_session';

// Función simple para verificar si hay cookie de sesión
// La validación real se hace en las API routes y el cliente
function hasSessionCookie(request: NextRequest): boolean {
  const cookie = request.cookies.get(COOKIE_NAME);
  return !!cookie?.value;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas
  if (pathname === '/' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Verificar cookie de sesión (check básico)
  if (!hasSessionCookie(request)) {
    // Redirigir a login
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Añadir headers de seguridad
  const response = NextResponse.next();
  
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
