'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function parseCount(str) {
  if (!str) return { num: 0, suffix: '' };
  const match = String(str).match(/^(\d+)(\D*)$/);
  if (!match) return { num: 0, suffix: '' };
  return { num: parseInt(match[1], 10), suffix: match[2] ?? '' };
}

function AnimatedStat({ value, label }) {
  const elRef = useRef(null);
  const { num, suffix } = parseCount(value);

  useEffect(() => {
    const el = elRef.current;
    if (!el || num === 0) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: num,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate() {
        el.innerText = Math.round(obj.val) + suffix;
      },
      onComplete() {
        el.innerText = num + suffix;
      },
    });
  }, [num, suffix]);

  return (
    <div className="stat-item">
      <div className="stat-val" ref={elRef}>{value}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

export default function StatsCounter({ projectsCount, yearsCount, regionsCount }) {
  return (
    <>
      <style>{`
        .stats-bar {
          background: #ffffff;
          border-bottom: 1px solid rgba(10,22,40,0.08);
        }
        .stats-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          padding: 0 2.5rem;
        }
        .stat-item {
          flex: 1;
          text-align: center;
          padding: 2.25rem 1.5rem;
          border-right: 1px solid rgba(10,22,40,0.07);
        }
        .stat-item:last-child { border-right: none; }
        .stat-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2.75rem;
          font-weight: 800;
          color: #0a1628;
          line-height: 1;
          margin-bottom: 0.3rem;
        }
        .stat-val em { color: #00a3ff; font-style: normal; }
        .stat-lbl {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(10,22,40,0.4);
        }
        @media (max-width: 860px) {
          .stats-inner { flex-wrap: wrap; padding: 0 1.25rem; }
          .stat-item { min-width: 50%; border-right: none; border-bottom: 1px solid rgba(10,22,40,0.07); }
        }
        @media (max-width: 580px) {
          .stat-item { min-width: 100%; }
        }
      `}</style>
      <div className="stats-bar">
        <div className="stats-inner">
          <AnimatedStat value={projectsCount} label="Projets Livrés" />
          <AnimatedStat value={yearsCount} label="Années d'Expérience" />
          <AnimatedStat value={regionsCount} label="Régions Couvertes" />
          <div className="stat-item">
            <div className="stat-val">100%</div>
            <div className="stat-lbl">Marchés Publics</div>
          </div>
        </div>
      </div>
    </>
  );
}
