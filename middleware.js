import { NextResponse } from 'next/server';

export function middleware(req) {
  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return new NextResponse('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Protected"' },
    });
  }
  const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');
  if (user !== process.env.BASIC_AUTH_USER || pass !== process.env.BASIC_AUTH_PASS) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|favicon.ico|.*\\.(png|jpg|jpeg|gif|svg|webp|css|js|map)).*)'],
};
