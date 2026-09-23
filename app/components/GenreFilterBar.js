'use client';

import { useState } from 'react';

const GENRES = ['AIV Originals', 'Classic Horror', 'Sci-Fi', 'Horror', 'Comedy'];

export default function GenreFilterBar({ onSelect }) {
  const [active, setActive] = useState(null);

  function handleClick(genre) {
    const next = active === genre ? null : genre;
    setActive(next);
    onSelect?.(next);
  }

  return (
    <div style={{ display: 'flex', gap: '12px', padding: '16px 48px', flexWrap: 'wrap' }}>
      {GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => handleClick(genre)}
          style={{
            padding: '8px 20px',
            borderRadius: '999px',
            border: active === genre ? '1px solid #e50914' : '1px solid #333',
            background: active === genre ? '#e50914' : '#111',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

