'use client';

import { useState } from 'react';
import Link from 'next/link';

const CATEGORY_BG = {
  Distribution: 'linear-gradient(135deg, #0a1628, #0d2040)',
  'Éclairage': 'linear-gradient(135deg, #003d7a, #005fa3)',
  Solaire: 'linear-gradient(135deg, #005fa3, #0079cc)',
  VRD: 'linear-gradient(135deg, #0a1628, #0f1e35)',
};
const DEFAULT_BG = 'linear-gradient(135deg, #0a1628, #162540)';

export default function ProjectsClient({ projects }) {
  const categories = [
    'Tous',
    ...new Set(projects.map((p) => p.category).filter(Boolean)),
  ];

  const [active, setActive] = useState('Tous');

  const filtered =
    active === 'Tous' ? projects : projects.filter((p) => p.category === active);

  return (
    <>
    <style>{`
      /* FILTER BAR */
      .filter-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 2.5rem;
      }
      .filter-label {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(10,22,40,0.4);
        margin-right: 0.5rem;
      }
      .filter-btn {
        font-family: 'Barlow', sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 0.5rem 1.1rem;
        border-radius: 4px;
        border: 1.5px solid rgba(10,22,40,0.12);
        background: transparent;
        color: rgba(10,22,40,0.55);
        cursor: pointer;
        transition: all 0.2s;
      }
      .filter-btn:hover {
        border-color: rgba(10,22,40,0.3);
        color: #0a1628;
      }
      .filter-btn.active {
        background: var(--blue);
        border-color: var(--blue);
        color: #ffffff;
      }

      /* PROJECT GRID */
      .proj-full-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
      }
      .proj-full-card {
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(10,22,40,0.07);
        background: #ffffff;
        transition: transform 0.22s, box-shadow 0.22s;
        display: block;
        text-decoration: none;
        color: inherit;
      }
      .proj-full-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 24px 64px rgba(10,22,40,0.12);
      }
      .proj-full-thumb {
        height: 160px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: 1rem;
      }
      .proj-full-badge {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        background: rgba(0,163,255,0.9);
        color: #ffffff;
        padding: 0.25rem 0.65rem;
        border-radius: 3px;
        backdrop-filter: blur(4px);
      }
      .proj-full-year {
        font-size: 0.72rem;
        font-weight: 600;
        color: rgba(255,255,255,0.75);
        letter-spacing: 0.08em;
      }
      .proj-full-body { padding: 1.5rem; }
      .proj-full-title {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 1.15rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: #0a1628;
        margin-bottom: 0.75rem;
        line-height: 1.2;
      }
      .proj-full-meta {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        margin-bottom: 0.5rem;
      }
      .proj-full-meta-row {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 0.82rem;
        color: rgba(10,22,40,0.5);
      }
      .proj-full-meta-row svg {
        width: 13px;
        height: 13px;
        stroke: #00a3ff;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        flex-shrink: 0;
      }

      /* EMPTY STATE */
      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: rgba(10,22,40,0.35);
      }
      .empty-state p {
        font-size: 1rem;
        margin-top: 0.5rem;
      }

      /* RESPONSIVE */
      @media (max-width: 1024px) {
        .proj-full-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 640px) {
        .proj-full-grid { grid-template-columns: 1fr; }
        .filter-bar { gap: 0.4rem; }
      }
    `}</style>
      <section className="section">
      <div className="container">
        {/* Filter bar — categories derived from actual data */}
        <div className="filter-bar">
          <span className="filter-label">Filtrer :</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn${active === cat ? ' active' : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="proj-full-grid">
            {filtered.map((p) => {
              const thumbBg = p.coverImage?.url
                ? `url(${p.coverImage.url}) center/cover no-repeat`
                : (CATEGORY_BG[p.category] ?? DEFAULT_BG);
              return (
                <Link key={p.slug} href={`/realisations/${p.slug}`} className="proj-full-card">
                  <div className="proj-full-thumb" style={{ background: thumbBg }}>
                    <span className="proj-full-badge">{p.category}</span>
                    <span className="proj-full-year">{p.year}</span>
                  </div>
                  <div className="proj-full-body">
                    <div className="proj-full-title">{p.title}</div>
                    <div className="proj-full-meta">
                      <div className="proj-full-meta-row">
                        <svg viewBox="0 0 24 24">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {p.region}
                      </div>
                      <div className="proj-full-meta-row">
                        <svg viewBox="0 0 24 24">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        {p.client}
                      </div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '1rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)' }}>
                      Voir le projet →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <strong>Aucun projet pour ce filtre</strong>
            <p>Essayez un autre filtre ou consultez tous les projets.</p>
          </div>
        )}
      </div>
    </section>
    </>
  );
}
