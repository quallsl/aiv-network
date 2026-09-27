'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/support', label: 'Support / FAQ' },
  { href: '/signin', label: 'Sign In', cta: true },
];

export default function MenuBar({ showBack = true }) {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const linkStyle = (l) => ({
    color: '#fff',
    textDecoration: 'none',
    fontSize: 15,
    padding: '8px 14px',
    borderRadius: 4,
    whiteSpace: 'nowrap',
    background: l.cta ? '#e50914' : 'transparent',
    fontWeight: path === l.href ? 700 : 400,
    borderBottom:
      !l.cta && path === l.href ? '2px solid #e50914' : '2px solid transparent',
  });

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        boxSizing: 'border-box',
        background: 'rgba(0,0,0,0.9)',
        borderBottom: '1px solid #222',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 4vw',
      }}
    >
      {showBack && (
        <button
          onClick={goBack}
          aria-label="Go back"
          style={{
            background: 'none',
            border: '1px solid #444',
            color: '#fff',
            borderRadius: 4,
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: 15,
          }}
        >
          ← Back
        </button>
      )}

      <Link
        href="/"
        style={{
          color: '#e50914',
          fontWeight: 800,
          fontSize: 22,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        AIV NETWORK
      </Link>

      <div
        className="mb-links"
        style={{
          marginLeft: 'auto',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} style={linkStyle(l)}>
            {l.label}
          </Link>
        ))}
      </div>

      <button
        className="mb-burger"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        style={{
          marginLeft: 'auto',
          display: 'none',
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: 26,
          cursor: 'pointer',
        }}
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#000',
            borderBottom: '1px solid #222',
            display: 'flex',
            flexDirection: 'column',
            padding: 12,
            gap: 4,
          }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={linkStyle(l)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .mb-links { display: none !important; }
          .mb-burger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}