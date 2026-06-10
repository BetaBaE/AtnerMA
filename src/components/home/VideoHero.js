'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

const VIMEO_ID = '1021678297';
const VIMEO_H  = 'e8e044a211';

export default function VideoHero({ title, subtitle, ctaLabel }) {
  const iframeRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.onload = () => {
      if (!iframeRef.current) return;
      // eslint-disable-next-line no-undef
      playerRef.current = new Vimeo.Player(iframeRef.current);
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  function toggleMute() {
    const player = playerRef.current;
    if (!player) return;
    if (muted) {
      player.setVolume(1);
      player.setMuted(false);
    } else {
      player.setMuted(true);
    }
    setMuted(!muted);
  }

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
          /* Vimeo iframe needs to be larger than viewport to fill & crop like object-fit:cover */
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          min-width: 177.78vh; /* 16/9 ratio */
          min-height: 56.25vw;
          width: 100%;
          height: 100%;
          border: none;
          pointer-events: none;
        }
        .video-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom, rgba(10,22,40,0.4) 0%, rgba(10,22,40,0.15) 40%, rgba(10,22,40,0.85) 100%);
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
        .mute-btn {
          position: absolute;
          bottom: 2.5rem;
          right: 2.5rem;
          z-index: 2;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.25);
          background: rgba(10,22,40,0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .mute-btn:hover {
          background: rgba(0,163,255,0.2);
          border-color: rgba(0,163,255,0.5);
        }
        .mute-btn svg {
          width: 18px;
          height: 18px;
          stroke: #ffffff;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        @media (max-width: 860px) {
          .video-hero-content { width: 70%; left: 1.25rem; bottom: 4rem; }
          .mute-btn { bottom: 1.5rem; right: 1.25rem; }
          .video-hero-scroll { display: none; }
        }
      `}</style>

      <section className="video-hero">
        {/* Background video — Vimeo background mode */}
        <iframe
          ref={iframeRef}
          className="video-hero-bg"
          src={`https://player.vimeo.com/video/${VIMEO_ID}?h=${VIMEO_H}&background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0`}
          allow="autoplay; fullscreen"
          title="Hero background video"
        />

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

        {/* Mute toggle */}
        <button className="mute-btn" onClick={toggleMute} aria-label={muted ? 'Activer le son' : 'Couper le son'}>
          {muted ? (
            <svg viewBox="0 0 24 24">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </section>
    </>
  );
}
