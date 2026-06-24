'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export default function SiteIntroLogo() {
  const overlayRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Only show if the full intro is NOT showing
    const last = localStorage.getItem('atner_intro_ts');
    const thirtyMin = 30 * 60 * 1000;
    const fullIntroShowing = !last || (Date.now() - Number(last)) > thirtyMin;
    if (fullIntroShowing) return;

    overlay.style.display = 'flex';

    const tl = gsap.timeline();
    tl.fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: 'power2.out' }
    )
    .to({}, { duration: 0.65 })
    .to(overlay, {
      opacity: 0,
      duration: 0.45,
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
        background: 'radial-gradient(ellipse at center, #0d2040 0%, #060e1c 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        pointerEvents: 'none',
      }}
    >
      <Image
        src="/LOGO_rev.png"
        alt="ATNER"
        width={150}
        height={150}
        style={{ objectFit: 'contain' }}
        priority
      />
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: '1.5rem',
        color: '#ffffff',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
      }}>
        {/*ATNER */}
      </div>
      <div style={{
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
      }}>
        {/* Atlas Énergie · */}Maroc
      </div>
    </div>
  );
}
