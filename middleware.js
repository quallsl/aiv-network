import { NextResponse } from 'next/server';

const COOKIE_NAME = 'aiv_admin_session';

function bufToHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sign(data, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign'
  ]);
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return bufToHex(sigBuf);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

async function verifyToken(token, secret) {
  if (!token) return false;
  const [expiryStr, sig] = token.split('.');
  if (!expiryStr || !sig) return false;
  const expiry = Number(expiryStr);
  if (!expiry || Date.now() > expiry) return false;
  const expected = await sign(expiryStr, secret);
  return timingSafeEqual(sig, expected);
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Let the login page and its API through untouched.
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/admin/verify')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const valid = await verifyToken(token, process.env.ADMIN_SESSION_SECRET);

  if (!valid) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Scoped to just the agent activity page so this never collides with any
// other admin auth you already have elsewhere in the app. Widen to
// '/admin/:path*' if you want the same gate on more admin pages.
export const config = {
  matcher: ['/admin/agent-activity/:path*']
};
