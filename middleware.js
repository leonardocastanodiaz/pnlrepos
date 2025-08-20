// SOLECALVO/middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const p = req.nextUrl.pathname;

  // ➜ Salta assets/infra (haz la lista que necesites)
  if (
    p.startsWith('/_next') ||
    p === '/favicon.ico' ||
    /\.(png|jpg|jpeg|gif|svg|webp|css|js|map)$/.test(p)
  ) {
    return NextResponse.next();
  }

  // ➜ Basic Auth (Edge runtime: usa atob, no Buffer)
  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return new NextResponse('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Protected"' },
    });
  }
  const [user, pass] = atob(encoded).split(':');
  if (user !== process.env.BASIC_AUTH_USER || pass !== process.env.BASIC_AUTH_PASS) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}

// ❗ Matcher sin grupos/regex complejos
export const config = {
  matcher: ['/:path*'],
};
