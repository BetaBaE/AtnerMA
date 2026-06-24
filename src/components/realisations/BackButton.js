'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mirrors the Navbar visibility threshold (50% VH).
// Visible when the navbar is hidden; hides when navbar appears.
export default function BackButton({ href, label }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY <= window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Link
      href={href}
      style={{
        position: 'fixed',
        top: '1.25rem',
        left: '1.5rem',
        zIndex: 150,
        background: 'rgba(10,22,40,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        padding: '0.45rem 1rem',
        borderRadius: '4px',
        color: 'rgba(255,255,255,0.85)',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease, background 0.2s',
      }}
    >
      ← {label}
    </Link>
  );
}
