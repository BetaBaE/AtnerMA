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
    <section className="section">
      <div className="container">
        <div className="filter-bar">
          <span className="filter-label">Filtrer :</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="filter-btn"
              style={active === cat ? { background: '#0066cc', borderColor: '#0066cc', color: '#ffffff' } : {}}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

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
  );
}
