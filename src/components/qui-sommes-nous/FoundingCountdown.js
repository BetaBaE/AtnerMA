'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FOUNDING_YEAR = 1988;

export default function FoundingCountdown() {
  const yearRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const yearsActive = currentYear - FOUNDING_YEAR;

  useEffect(() => {
    const el = yearRef.current;
    if (!el) return;

    const obj = { val: currentYear };
    gsap.to(obj, {
      val: FOUNDING_YEAR,
      duration: 3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate() {
        el.innerText = Math.round(obj.val);
      },
      onComplete() {
        el.innerText = currentYear;
      },
    });
  }, [currentYear]);

  return (
    <section style={{
      background: '#0a1628',
      padding: '5rem 2.5rem',
      textAlign: 'center',
    }}>
      <div ref={yearRef} style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 'clamp(5rem, 12vw, 10rem)',
        fontWeight: 800,
        color: '#00a3ff',
        lineHeight: 1,
        marginBottom: '0.5rem',
      }}>
        {FOUNDING_YEAR}
      </div>
      <p style={{
        fontSize: '1.1rem',
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: '0.04em',
        marginBottom: '2.5rem',
      }}>
        années d&apos;expertise au service de l&apos;énergie
      </p>
      <div style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
        background: 'rgba(0,163,255,0.08)',
        border: '1px solid rgba(0,163,255,0.2)',
        borderRadius: '8px',
        padding: '1.25rem 2.5rem',
      }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '3rem',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1,
        }}>
          {yearsActive}
        </span>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
        }}>
          ans d&apos;activité
        </span>
      </div>
    </section>
  );
}
