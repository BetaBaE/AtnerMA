'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function SiteIntro() {
  const overlayRef = useRef(null);
  const yearRef = useRef(null);
  const labelRef = useRef(null);
  const descRef = useRef(null);
  const progressRef = useRef(null);
  const layerARef = useRef(null);
  const layerBRef = useRef(null);
  const activeLayer = useRef('a');

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // currentYear only computed on the client
    const currentYear = new Date().getFullYear();

    const PERIODS = [
      {
        yearStart: currentYear,
        yearEnd: 2015,
        label: "Aujourd'hui",
        desc: "Expansion nationale et projets d'envergure",
        image: '/intro/load_LAST.jpg',
      },
      {
        yearStart: 2015,
        yearEnd: 2009,
        label: '2009 — 2015',
        desc: 'Diversification et nouvelles expertises',
        image: '/intro/load_4.jpg',
      },
      {
        yearStart: 2009,
        yearEnd: 2004,
        label: '2004 — 2009',
        desc: 'Croissance et marchés publics nationaux',
        image: '/intro/load_3.jpg',
      },
      {
        yearStart: 2004,
        yearEnd: 1996,
        label: '1996 — 2004',
        desc: 'Premiers grands marchés publics',
        image: '/intro/load_2.jpg',
      },
      {
        yearStart: 1996,
        yearEnd: 1988,
        label: '1988 — 1996',
        desc: 'Création et spécialisation hydraulique',
        image: '/intro/load_1.jpg',
      },
    ];

    // Show overlay (starts display:none to avoid SSR flash)
    overlay.style.display = 'flex';

    let cancelled = false;
    const ctx = gsap.context(() => {}, overlay);

    async function crossfadeTo(imagePath) {
      const layerA = layerARef.current;
      const layerB = layerBRef.current;
      if (!layerA || !layerB) return;

      if (activeLayer.current === 'a') {
        layerB.style.backgroundImage = `url(${imagePath})`;
        gsap.to(layerB, { opacity: 1, duration: 0.8, ease: 'power2.inOut' });
        gsap.to(layerA, { opacity: 0, duration: 0.8, ease: 'power2.inOut' });
        activeLayer.current = 'b';
      } else {
        layerA.style.backgroundImage = `url(${imagePath})`;
        gsap.to(layerA, { opacity: 1, duration: 0.8, ease: 'power2.inOut' });
        gsap.to(layerB, { opacity: 0, duration: 0.8, ease: 'power2.inOut' });
        activeLayer.current = 'a';
      }
      await new Promise((r) => setTimeout(r, 800));
    }

    async function countTo(from, to) {
      return new Promise((resolve) => {
        const steps = Math.abs(to - from);
        const duration = Math.max(600, steps * 18);
        const interval = duration / steps;
        let current = from;
        const tick = setInterval(() => {
          if (cancelled) { clearInterval(tick); resolve(); return; }
          current -= 1;
          if (yearRef.current) yearRef.current.innerText = current;
          gsap.fromTo(
            yearRef.current,
            { opacity: 0.5, scale: 0.97 },
            { opacity: 1, scale: 1, duration: 0.04, ease: 'power1.out' }
          );
          if (current <= to) { clearInterval(tick); resolve(); }
        }, interval);
      });
    }

    async function holdPeriod(index) {
      const p = PERIODS[index];
      await crossfadeTo(p.image);
      if (cancelled) return;
      if (labelRef.current) labelRef.current.innerText = p.label;
      if (descRef.current) descRef.current.innerText = p.desc;
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
      // Fix 1: reveal year only after font is ready
      if (yearRef.current) {
        yearRef.current.style.visibility = 'visible';
        yearRef.current.innerText = currentYear;
      }
      // Fix 2: set initial image immediately so first period isn't blank
      if (layerARef.current) {
        layerARef.current.style.backgroundImage = 'url(/intro/load_LAST.jpg)';
      }
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
      await countTo(2004, 1996);
      if (cancelled) return;
      await holdPeriod(3);
      if (cancelled) return;
      await countTo(1996, 1988);
      if (cancelled) return;
      await holdPeriod(4);
      if (cancelled) return;

      gsap.to(progressRef.current, { width: '100%', duration: 0.4 });
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;

      document.body.classList.remove('intro-playing');
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete: () => { overlay.style.display = 'none'; },
      });
    }

    runIntro();

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        display: 'none', // shown by effect only when needed
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0a1628',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Image layer A — first image set by effect */}
      <div
        ref={layerARef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/intro/load_LAST.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 1,
        }}
      />

      {/* Image layer B — starts hidden */}
      <div
        ref={layerBRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0,
        }}
      />

      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Vertical separator */}
      <div style={{
        position: 'absolute',
        left: '60%',
        top: '20%',
        height: '60%',
        width: '1px',
        background: 'rgba(255,255,255,0.1)',
        zIndex: 2,
      }} />

      {/* Left side — 60% */}
      <div style={{
        width: '60%',
        padding: '0 5vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
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
            visibility: 'hidden',
          }}
        />
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
        />
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
        />
      </div>

      {/* Right side — 40% */}
      <div style={{
        width: '40%',
        padding: '0 5vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.4rem',
        position: 'relative',
        zIndex: 2,
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
          zIndex: 2,
        }}
      />
    </div>
  );
}
