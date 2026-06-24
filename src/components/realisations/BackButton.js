'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mirrors the Navbar visibility threshold (50% VH).
// Visible when navbar is hidden; fades out when navbar slides in.
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
    <>
      <style>{`
        .back-btn-fixed {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          z-index: 90;
          background: rgba(10,22,40,0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 6px;
          padding: 0.6rem 1.2rem;
          color: #ffffff;
          font-family: 'Barlow', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s ease;
        }
        .back-btn-fixed:hover {
          background: #0066cc;
        }
        @media (max-width: 640px) {
          .back-btn-fixed {
            padding: 0.45rem 0.85rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
      <Link
        href={href}
        className="back-btn-fixed"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transform: visible ? 'translateY(0)' : 'translateY(-8px)',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2.5"
             strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {label}
      </Link>
    </>
  );
}
