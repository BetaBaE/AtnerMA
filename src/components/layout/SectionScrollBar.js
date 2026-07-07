'use client';

import { useEffect, useRef, useState } from 'react';

const SECTION_THEME = {
  // Accueil
  hero:         'dark',
  stats:        'light',
  activites:    'light',
  realisations: 'light',
  clients:      'dark',
  cta:          'dark',

  // Activités
  'act-hero':         'dark',
  'act-activites':    'light',
  'act-methodologie': 'light',
  'act-references':   'light',
  'act-cta':          'dark',

  // Contact
  'contact-hero': 'dark',
  'contact-form': 'light',
  'contact-map':  'light',

  // Qui Sommes-Nous
  'qsn-hero':     'dark',
  'qsn-histoire': 'dark',
  'qsn-valeurs':  'light',
  'qsn-certs':    'light',
  'qsn-equipe':   'light',

  // Réalisations
  'real-hero':  'dark',
  'real-grid':  'dark',
  'real-phare': 'light',
  'real-cta':   'dark',

  // Project detail
  'detail-hero':    'dark',
  'detail-content': 'light',
  'detail-cta':     'dark',
};

const GAP_PX = 10;

export default function SectionScrollBar({ sections }) {
  const [progress,     setProgress]     = useState(0);
  const [active,       setActive]       = useState(0);
  const [segHeights,   setSegHeights]   = useState([]);
  const [trackHeight,  setTrackHeight]  = useState(0);
  const trackRef = useRef(null);
  const rafRef   = useRef(null);

  useEffect(() => {
    const els = sections.map(({ id }) => document.querySelector(`[data-section="${id}"]`));

    function measure() {
      const total = document.documentElement.scrollHeight;
      const raw   = els.map((el) => (el ? el.offsetHeight / total : 0));
      const sum   = raw.reduce((a, b) => a + b, 0);
      setSegHeights(sum > 0 ? raw.map((h) => h / sum) : raw.map(() => 1 / sections.length));
      if (trackRef.current) setTrackHeight(trackRef.current.offsetHeight);
    }

    function update() {
      const scrollY = window.scrollY;
      const docH    = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? scrollY / docH : 0);
      const mid = scrollY + window.innerHeight / 4;
      let found = 0;
      els.forEach((el, i) => { if (el && el.offsetTop <= mid) found = i; });
      setActive(found);
    }

    function onScroll() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { measure(); update(); }, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sections]);

  function scrollTo(id) {
    document.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: 'smooth' });
  }

  const totalGap = GAP_PX * (sections.length - 1);
  const usableH  = trackHeight - totalGap;

  return (
    <>
      <style>{`
        .ssb {
          position: fixed;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 200;
          pointer-events: none;
          height: 80vh;
          display: flex;
          align-items: stretch;
        }
        .ssb-track {
          position: relative;
          width: 3px;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: ${GAP_PX}px;
        }
        .ssb-seg {
          position: relative;
          width: 3px;
          border-radius: 2px;
          cursor: pointer;
          pointer-events: all;
          overflow: visible;
          flex-shrink: 0;
        }
        .ssb-seg-bg {
          position: absolute;
          inset: 0;
          border-radius: 2px;
          transition: background 0.4s;
        }
        /* fill clips the wave inside it via overflow:hidden */
        .ssb-seg-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          border-radius: 2px;
          transition: background 0.4s;
          will-change: height;
          overflow: visible;
        }
        .ssb-seg-title {
          position: absolute;
          right: 10px;
          top: 0;
          white-space: nowrap;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: opacity 0.3s, color 0.4s, font-size 0.3s, transform 0.3s;
          pointer-events: none;
          user-select: none;
          line-height: 1;
          transform-origin: right top;
        }
        @media (max-width: 860px) { .ssb { display: none; } }
      `}</style>

      <nav className="ssb" aria-label="Navigation par section">
        <div className="ssb-track" ref={trackRef}>
          {segHeights.length === sections.length && sections.map(({ id, label }, i) => {
            const isDark   = (SECTION_THEME[id] ?? 'dark') === 'dark';
            const isActive = i === active;

            const lineAlpha  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(10,22,40,0.15)';
            const fillColor  = isDark ? '#ffffff' : '#0a1628';

            const titleColor = isDark
              ? isActive ? '#ffffff' : 'rgba(255,255,255,0.45)'
              : isActive ? '#0a1628' : 'rgba(10,22,40,0.35)';

            const segStart    = segHeights.slice(0, i).reduce((a, b) => a + b, 0);
            const segFill     = Math.max(0, Math.min(1, (progress - segStart) / segHeights[i]));
            const segHeightPx = usableH > 0 ? segHeights[i] * usableH : 0;


            return (
              <div
                key={id}
                className="ssb-seg"
                style={{ height: segHeightPx }}
                onClick={() => scrollTo(id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && scrollTo(id)}
                aria-label={label}
              >
                <div className="ssb-seg-bg" style={{ background: lineAlpha }} />

                <div
                  className="ssb-seg-fill"
                  style={{ height: `${segFill * 100}%`, background: fillColor }}
                />

                <span
                  className="ssb-seg-title"
                  style={{
                    color: titleColor,
                    opacity: isActive ? 1 : 0.5,
                    fontSize: isActive ? '0.68rem' : '0.52rem',
                    transform: isActive ? 'scale(1)' : 'scale(0.95)',
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
