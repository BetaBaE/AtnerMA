'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export default function SiteIntroLogo() {
  const overlayRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    overlay.style.display = 'flex';

    const tl = gsap.timeline();
    tl.fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    )
    .to({}, { duration: 0.7 })
    .to(overlay, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        if (overlay) overlay.style.display = 'none';
      }
    });

    return () => tl.kill();
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        display: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0a1628',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        pointerEvents: 'none',
      }}
    >
      <Image
        src="/LOGO_Rev.png"
        alt="ATNER"
        width={80}
        height={80}
        style={{ objectFit: 'contain' }}
        priority
      />
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: '1.6rem',
        color: '#ffffff',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
      }}>
        ATNER
      </div>
      <div style={{
        fontSize: '0.62rem',
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
      }}>
        Atlas Énergie · Maroc
      </div>
    </div>
  );
}
