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
          flex-shrink: 0;
          margin: 0 0.85rem;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          overflow: hidden;
        }
      `}</style>

      <div className="marquee-outer">
        <div className="marquee-inner">
          {doubled.map((c, i) => (
            <div key={i} className="client-badge" title={c.full}>
              <Image
                src={c.logo}
                alt={c.name}
                width={130}
                height={130}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
