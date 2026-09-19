import { NextResponse } from 'next/server';

const COOKIE_NAME = 'aiv_admin_session';
const SESSION_LENGTH_MS = 12 * 60 * 60 * 1000; // 12 hours

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

export async function POST(request) {
  const { code } = await request.json();
  const expected = process.env.ADMIN_ACCESS_CODE || '';

  if (!code || typeof code !== 'string' || !timingSafeEqual(code, expected)) {
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const expiry = Date.now() + SESSION_LENGTH_MS;
  const sig = await sign(String(expiry), process.env.ADMIN_SESSION_SECRET);
  const token = `${expiry}.${sig}`;

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiry)
  });
  return res;
}
