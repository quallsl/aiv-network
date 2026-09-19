'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const inputs = [useRef(), useRef(), useRef(), useRef()];
  const router = useRouter();
  const params = useSearchParams();

  function handleChange(i, value) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[i] = value;
    setDigits(next);
    setError(false);
    if (value && i < 3) inputs[i + 1].current?.focus();
    if (value && i === 3) submit(next.join(''));
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs[i - 1].current?.focus();
    }
  }

  async function submit(code) {
    setChecking(true);
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    setChecking(false);

    if (res.ok) {
      router.push(params.get('next') || '/admin/agent-activity');
    } else {
      setError(true);
      setDigits(['', '', '', '']);
      inputs[0].current?.focus();
    }
  }

  return (
    <div
      style={{
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        gap: '24px'
      }}
    >
      <h1 style={{ fontSize: '20px', fontWeight: 500 }}>Admin access</h1>
      <div style={{ display: 'flex', gap: '12px' }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={inputs[i]}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            autoFocus={i === 0}
            disabled={checking}
            style={{
              width: '48px',
              height: '56px',
              textAlign: 'center',
              fontSize: '24px',
              background: '#111',
              border: `1px solid ${error ? '#e50914' : '#333'}`,
              borderRadius: '8px',
              color: '#fff'
            }}
          />
        ))}
      </div>
      {error && <p style={{ color: '#e50914', fontSize: '14px' }}>Incorrect code</p>}
    </div>
  );
}
