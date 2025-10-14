import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Exclusions: API routes, Next.js assets, static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/downloads/') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|txt|pdf|mp4|webm|woff2?)$/i)
  ) {
    return NextResponse.next();
  }

  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;
  if (!user || !pass) {
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization');
  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString('utf8');
      const [u, p] = decoded.split(':');
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    }
  }

  const res = new NextResponse('Authentication required', { status: 401 });
  res.headers.set('WWW-Authenticate', 'Basic realm="Protected"');
  return res;
}

export const config = {
  matcher: [
    '/((?!api/).*)',
  ],
};





