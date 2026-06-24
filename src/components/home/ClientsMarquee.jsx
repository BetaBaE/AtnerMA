'use client';
import Image from 'next/image';

export default function ClientsMarquee({ clients }) {
  const doubled = [...clients, ...clients];

  return (
    <>
      <style>{`
        .marquee-outer {
          overflow: hidden;
          width: 100%;
        }
        .marquee-inner {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marquee 28s linear infinite;
        }
        .marquee-outer:hover .marquee-inner {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .client-badge {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: #ffffff;
          border: 1.5px solid rgba(10,22,40,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          flex-shrink: 0;
          margin: 0 0.85rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          cursor: default;
          padding: 0.5rem;
        }
        .client-badge:hover {
          border-color: #00a3ff;
          box-shadow: 0 0 0 3px rgba(0,163,255,0.15);
        }
        .client-badge-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #0a1628;
          text-align: center;
          line-height: 1.2;
          white-space: nowrap;
        }
      `}</style>

      <div className="marquee-outer">
        <div className="marquee-inner">
          {doubled.map((c, i) => (
            <div key={i} className="client-badge" title={c.full}>
              <Image
                src={c.logo}
                alt={c.name}
                width={64}
                height={64}
                style={{ objectFit: 'contain' }}
              />
              <span className="client-badge-name">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
