import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // No pedir auth en producción (dominio real)
  if (process.env.VERCEL_ENV === 'production') {
    return NextResponse.next();
  }

  // Solo en PREVIEW/DEV pedimos Basic Auth
  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');

  if (scheme !== 'Basic' || !encoded) {
    return new NextResponse('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Protected"' },
    });
  }

  // Edge runtime: usar atob
  const decoded = atob(encoded);
  const [user, pass] = decoded.split(':');

  if (user !== process.env.PREVIEW_BASIC_USER || pass !== process.env.PREVIEW_BASIC_PASS) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}

// Excluir estáticos e imagen optimizer
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
