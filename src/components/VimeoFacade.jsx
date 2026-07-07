'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function VimeoFacade({ videoId, title, posterUrl }) {
  const [playing, setPlaying] = useState(false);
  const poster = posterUrl ?? `https://vumbnail.com/${videoId}.jpg`;

  return (
    <>
      <style>{`
        .vimeo-facade-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          display: block;
          background: #0a1628;
        }
        .vimeo-facade-iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .vimeo-facade-btn {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          padding: 0;
          background: none;
          cursor: pointer;
          display: block;
          pointer-events: auto;
        }
        .vimeo-facade-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--blue, #00a3ff);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s ease;
          pointer-events: none;
          z-index: 1;
        }
        .vimeo-facade-btn:hover .vimeo-facade-play {
          transform: translate(-50%, -50%) scale(1.08);
        }
        .vimeo-facade-play svg {
          width: 28px;
          height: 28px;
          fill: #ffffff;
          margin-left: 5px;
        }
      `}</style>

      <div className="vimeo-facade-wrap">
        {playing ? (
          <iframe
            className="vimeo-facade-iframe"
            src={`https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title={title}
          />
        ) : (
          <button
            type="button"
            className="vimeo-facade-btn"
            onClick={() => setPlaying(true)}
            aria-label={`Lire : ${title}`}
          >
            <Image
              src={poster}
              alt=""
              fill
              style={{ objectFit: 'cover' }}
              priority={false}
            />
            <span className="vimeo-facade-play" aria-hidden="true">
              <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </span>
          </button>
        )}
      </div>
    </>
  );
}
