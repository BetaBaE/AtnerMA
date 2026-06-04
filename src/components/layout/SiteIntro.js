'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const currentYear = new Date().getFullYear();

const PERIODS = [
  {
    yearStart: currentYear,
    yearEnd: 2015,
    label: "Aujourd'hui",
    desc: "Expansion nationale et projets d'envergure",
    bg: '#0a1628',
    image: null,
  },
  {
    yearStart: 2015,
    yearEnd: 2009,
    label: '2009 — 2015',
    desc: 'Diversification et nouvelles expertises',
    bg: '#0d1e35',
    image: null,
  },
  {
    yearStart: 2009,
    yearEnd: 2004,
    label: '2004 — 2009',
    desc: 'Croissance et marchés publics nationaux',
    bg: '#0f2240',
    image: null,
  },
  {
    yearStart: 2004,
    yearEnd: 1988,
    label: '1988 — 2004',
    desc: 'Création et spécialisation hydraulique',
    bg: '#122548',
    image: null,
  },
];

export default function SiteIntro() {
  const [year, setYear] = useState(currentYear);
  const [periodIndex, setPeriodIndex] = useState(0);
  const [periodLabel, setPeriodLabel] = useState('');
  const [periodDesc, setPeriodDesc] = useState('');
  const [shown, setShown] = useState(false);

  const overlayRef = useRef(null);
  const yearRef = useRef(null);
  const labelRef = useRef(null);
  const descRef = useRef(null);
  const progressRef = useRef(null);

  // Decide whether to show
  useEffect(() => {
    if (sessionStorage.getItem('atner_intro_seen')) {
      return;
    }
    sessionStorage.setItem('atner_intro_seen', 'true');
    setShown(true);
  }, []);

  // Run animation once shown
  useEffect(() => {
    if (!shown) return;

    let cancelled = false;
    const ctx = gsap.context(() => {}, overlayRef);

    async function countTo(from, to) {
      return new Promise((resolve) => {
        const steps = Math.abs(to - from);
        const duration = Math.max(600, steps * 18);
        const interval = duration / steps;
        let current = from;
        const tick = setInterval(() => {
          if (cancelled) { clearInterval(tick); resolve(); return; }
          current -= 1;
          setYear(current);
          gsap.fromTo(
            yearRef.current,
            { opacity: 0.5, scale: 0.97 },
            { opacity: 1, scale: 1, duration: 0.04, ease: 'power1.out' }
          );
          if (current <= to) {
            clearInterval(tick);
            resolve();
          }
        }, interval);
      });
    }

    async function holdPeriod(index) {
      const p = PERIODS[index];
      setPeriodIndex(index);
      setPeriodLabel(p.label);
      setPeriodDesc(p.desc);
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo(
        descRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' }
      );
      await new Promise((r) => setTimeout(r, 1500));
      if (cancelled) return;
      gsap.to(labelRef.current, { opacity: 0, duration: 0.25 });
      gsap.to(descRef.current, { opacity: 0, duration: 0.25 });
      await new Promise((r) => setTimeout(r, 300));
    }

    async function runIntro() {
      await countTo(currentYear, 2015);
      if (cancelled) return;
      await holdPeriod(0);
      if (cancelled) return;
      await countTo(2015, 2009);
      if (cancelled) return;
      await holdPeriod(1);
      if (cancelled) return;
      await countTo(2009, 2004);
      if (cancelled) return;
      await holdPeriod(2);
      if (cancelled) return;
      await countTo(2004, 1988);
      if (cancelled) return;
      await holdPeriod(3);
      if (cancelled) return;

      gsap.to(progressRef.current, { width: '100%', duration: 0.4 });
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.display = 'none';
        },
      });
    }

    runIntro();

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [shown]);

  if (!shown) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: PERIODS[periodIndex].bg,
        transition: 'background-color 0.8s ease',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Vertical separator */}
      <div style={{
        position: 'absolute',
        left: '60%',
        top: '20%',
        height: '60%',
        width: '1px',
        background: 'rgba(255,255,255,0.1)',
      }} />

      {/* Left side — 60% */}
      <div style={{
        width: '60%',
        padding: '0 5vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div
          ref={yearRef}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(6rem, 18vw, 13rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '1.5rem',
          }}
        >
          {year}
        </div>
        <div
          ref={labelRef}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '1.1rem',
            color: '#00a3ff',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            opacity: 0,
          }}
        >
          {periodLabel}
        </div>
        <div
          ref={descRef}
          style={{
            fontSize: '0.88rem',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '0.5rem',
            maxWidth: '320px',
            lineHeight: 1.6,
            opacity: 0,
          }}
        >
          {periodDesc}
        </div>
      </div>

      {/* Right side — 40% */}
      <div style={{
        width: '40%',
        padding: '0 5vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.4rem',
      }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: '1.8rem',
          color: '#ffffff',
          letterSpacing: '0.2em',
        }}>
          ATNER
        </div>
        <div style={{
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}>
          Atlas Énergie · Maroc
        </div>
      </div>

      {/* Progress bar */}
      <div
        ref={progressRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          width: '0%',
          background: 'linear-gradient(90deg, #00a3ff, #0066cc)',
        }}
      />
    </div>
  );
}
