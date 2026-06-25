'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import ActivityCard from '@/components/home/ActivityCard';

const VISIBLE = 3;
const GAP_PX = 20; // 1.25rem at 16px base

const ActivityIcon = ({ id }) => {
  const p = { viewBox: '0 0 24 24', fill: 'none', stroke: 'white', strokeWidth: '1.75', strokeLinecap: 'round', strokeLinejoin: 'round', width: 24, height: 24 };
  if (id === 'distribution') return <svg {...p}><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
  if (id === 'eclairage')    return <svg {...p}><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>;
  if (id === 'solaire')      return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
  if (id === 'postes')       return <svg {...p}><rect x="3" y="11" width="18" height="10" rx="1" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><line x1="12" y1="15" x2="12" y2="17" strokeWidth="2" /></svg>;
  if (id === 'vrd')          return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
  return <svg {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
};

export default function ActivitiesCarousel({ activities, highlightSlug }) {
  const N = activities.length;
  const tripled = [...activities, ...activities, ...activities];

  const viewportRef  = useRef(null);
  const trackRef     = useRef(null);
  const fadeTimerRef = useRef(null);
  const didHighlight = useRef(false);
  const autoRef      = useRef(null);

  const [index, setIndex]         = useState(N); // start in middle copy
  const [cardWidth, setCardWidth] = useState(0);

  // Measure viewport width → derive exact card width in pixels
  useEffect(() => {
    const measure = () => {
      const cw = viewportRef.current?.offsetWidth ?? 0;
      if (cw > 0) setCardWidth((cw - (VISIBLE - 1) * GAP_PX) / VISIBLE);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Silently reset track position with no visible jump
  const silentJump = useCallback((newIndex) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = 'none';
    setIndex(newIndex);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (trackRef.current) {
          trackRef.current.style.transition =
            'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
      });
    });
  }, []);

  // Infinite-loop boundary: after transition completes, silently jump back into middle copy
  useEffect(() => {
    if (index >= 2 * N) {
      const t = setTimeout(() => silentJump(index - N), 460);
      return () => clearTimeout(t);
    }
    if (index < N) {
      const t = setTimeout(() => silentJump(index + N), 460);
      return () => clearTimeout(t);
    }
  }, [index, N, silentJump]);

  // Smooth animate to highlighted card, then apply 2s glow
  useEffect(() => {
    if (!highlightSlug || cardWidth === 0 || didHighlight.current) return;
    didHighlight.current = true;

    const cardIndex = activities.findIndex((a) => a.slug === highlightSlug);
    if (cardIndex === -1) return;

    // Center the card when possible; for index 0 it is leftmost of 3
    const targetIndex = Math.max(N, N + cardIndex - 1);
    setIndex(targetIndex);

    const glowTimer = setTimeout(() => {
      const glowEl = viewportRef.current?.closest('.carousel-outer')
        ?.querySelector(`[data-carousel-index="${N + cardIndex}"]`);
      if (!glowEl) return;

      glowEl.style.transition = 'box-shadow 0.3s';
      glowEl.style.boxShadow =
        '0 0 0 3px rgba(0,163,255,0.4), 0 0 18px rgba(0,163,255,0.2)';

      fadeTimerRef.current = setTimeout(() => {
        glowEl.style.transition = 'box-shadow 0.6s';
        glowEl.style.boxShadow = 'none';
      }, 2000);
    }, 500);

    return () => {
      clearTimeout(glowTimer);
      clearTimeout(fadeTimerRef.current);
    };
  }, [highlightSlug, cardWidth, activities, N]);

  const stopAuto  = useCallback(() => { clearInterval(autoRef.current); }, []);
  const startAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setIndex((i) => i + 1), 20000);
  }, []);

  // Auto-advance on mount, clear on unmount
  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  const goLeft  = useCallback(() => { setIndex((i) => i - 1); startAuto(); }, [startAuto]);
  const goRight = useCallback(() => { setIndex((i) => i + 1); startAuto(); }, [startAuto]);

  const translateX = cardWidth > 0 ? -(index * (cardWidth + GAP_PX)) : 0;

  return (
    <>
      <style>{`
        .carousel-outer {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
        }
        .carousel-viewport {
          overflow-x: hidden;
          overflow-y: visible;
          flex: 1;
          min-width: 0;
          padding-top: 8px;
          padding-bottom: 8px;
        }
        .carousel-track {
          display: flex;
          gap: 1.25rem;
          transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
        }
        .carousel-card-wrap {
          flex-shrink: 0;
          border-radius: 6px;
        }
        .carousel-btn {
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(10,22,40,0.06);
          border: 1px solid rgba(10,22,40,0.12);
          color: #0a1628;
          font-size: 1rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .carousel-btn:hover {
          background: #0066cc;
          border-color: #0066cc;
          color: #ffffff;
        }
      `}</style>

      <div className="carousel-outer" onMouseEnter={stopAuto} onMouseLeave={startAuto}>
        <button className="carousel-btn" onClick={goLeft} aria-label="Précédent">←</button>

        <div className="carousel-viewport" ref={viewportRef}>
          <div
            className="carousel-track"
            ref={trackRef}
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {tripled.map((a, i) => (
              <div
                key={i}
                data-carousel-index={i}
                className="carousel-card-wrap"
                style={{
                  width: cardWidth > 0
                    ? `${cardWidth}px`
                    : `calc(33.333% - 0.834rem)`,
                }}
              >
                <ActivityCard
                  activity={a}
                  icon={<ActivityIcon id={a.icon} />}
                  classPrefix="act-full"
                  showArrow={false}
                />
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-btn" onClick={goRight} aria-label="Suivant">→</button>
      </div>
    </>
  );
}
