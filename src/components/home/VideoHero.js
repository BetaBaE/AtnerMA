'use client';

import Link from 'next/link';
import VimeoFacade from '@/components/VimeoFacade';

const VIMEO_ID = '1021678297';

export default function VideoHero({ title, subtitle, ctaLabel }) {
  return (
    <>
      <style>{`
        .video-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
        }
        .video-hero-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          min-width: 177.78vh;
          min-height: 56.25vw;
          width: 100%;
          height: 100%;
          border: none;
          pointer-events: none;
        }
        /* Allow VimeoFacade to fill the cover background slot */
        .video-hero-bg .vimeo-facade-wrap {
          aspect-ratio: unset;
          height: 100%;
        }
        .video-hero-bg .vimeo-facade-btn {
          pointer-events: auto;
        }
        .video-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom, rgba(10,22,40,0.4) 0%, rgba(10,22,40,0.15) 40%, rgba(10,22,40,0.85) 100%);
          pointer-events: none;
        }
        .video-hero-content {
          position: absolute;
          bottom: 5rem;
          left: 2.5rem;
          z-index: 2;
          width: 25%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .video-hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #00a3ff;
          margin-bottom: 1.5rem;
        }
        .video-hero-kicker::before {
          content: '';
          display: block;
          width: 28px;
          height: 2px;
          background: #00a3ff;
          flex-shrink: 0;
        }
        .video-hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.6rem, 2.2vw, 2.8rem);
          font-weight: 800;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: #ffffff;
          line-height: 1.05;
          margin-bottom: 1rem;
        }
        .video-hero-sub {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          margin-bottom: 1.75rem;
        }
        .video-hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .video-hero-scroll {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255,255,255,0.4);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          animation: bounce 2s ease-in-out infinite;
        }
        .video-hero-scroll svg {
          width: 20px;
          height: 20px;
          stroke: rgba(255,255,255,0.35);
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }
        @media (max-width: 860px) {
          .video-hero-content { width: 70%; left: 1.25rem; bottom: 4rem; }
          .video-hero-scroll { display: none; }
        }
      `}</style>

      <section className="video-hero">
        {/* Background — lazy-loaded via click-to-play facade */}
        <div className="video-hero-bg">
          <VimeoFacade videoId={VIMEO_ID} title="Hero background video" />
        </div>

        {/* Dark overlay */}
        <div className="video-hero-overlay" aria-hidden="true" />

        {/* Content */}
        <div className="video-hero-content">
          <div className="video-hero-kicker">BTP &amp; Énergie · Maroc</div>
          <h1 className="video-hero-title">{title}</h1>
          <p className="video-hero-sub">{subtitle}</p>
          <div className="video-hero-actions">
            <Link href="/contact" className="btn btn-primary">{ctaLabel}</Link>
            <Link href="/realisations" className="btn btn-outline-white">Voir nos Réalisations →</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="video-hero-scroll" aria-hidden="true">
          <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
          Scroll
        </div>
      </section>
    </>
  );
}
