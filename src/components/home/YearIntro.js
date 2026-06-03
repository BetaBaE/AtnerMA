'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

const FOUNDING_YEAR = 1988;

export default function YearIntro() {
  const currentYear = new Date().getFullYear();
  const [displayYear, setDisplayYear] = useState(FOUNDING_YEAR);
  const overlayRef = useRef(null);
  const progressRef = useRef(null);
  const numberRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const progress = progressRef.current;
    const number = numberRef.current;
    if (!overlay || !progress || !number) return;

    const duration = 2500;
    const intervalMs = 30;
    const totalSteps = duration / intervalMs;
    const range = currentYear - FOUNDING_YEAR;
    let step = 0;

    // Entrance animation on the number
    gsap.fromTo(number, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });

    // Progress bar
    gsap.fromTo(progress, { width: '0%' }, { width: '100%', duration: duration / 1000, ease: 'power2.inOut' });

    const interval = setInterval(() => {
      step++;
      const t = step / totalSteps;
      const eased = 1 - Math.pow(1 - t, 3); // ease out cubic
      const year = Math.round(FOUNDING_YEAR + eased * range);
      setDisplayYear(year);

      if (step >= totalSteps) {
        clearInterval(interval);
        setDisplayYear(currentYear);

        setTimeout(() => {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
              overlay.style.display = 'none';
            },
          });
        }, 500);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [currentYear]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0a1628',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div ref={numberRef} style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(6rem, 20vw, 16rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          {displayYear}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '1rem',
          }}
        >
          ANNÉES D&apos;EXPERTISE
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #00a3ff, #0066cc)',
          width: '0%',
        }}
        ref={progressRef}
      />
    </div>
  );
}
