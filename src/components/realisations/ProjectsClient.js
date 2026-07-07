'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Badge3D from '@/components/Badge3D';
import { ctfImage } from '@/lib/contentful-image';

const TYPE_COLORS = {
  Epuration:   '#0066cc',
  Traitement:  '#00a3ff',
  Dessalement: '#7c3aed',
  Transfert:   '#059669',
  Pompage:     '#d97706',
  Réservoirs:  '#dc2626',
};

// Extended bounds so Dakhla (Western Sahara) is fully visible
const MIN_LNG = -17.8, MAX_LNG = -0.5, MIN_LAT = 20.2, MAX_LAT = 36.4;
const VBW = 440, VBH = 640;

function proj(lng, lat) {
  return [
    ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * VBW,
    ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * VBH,
  ];
}

function ringToPath(ring) {
  return ring.map(([lng, lat], i) => {
    const [x, y] = proj(lng, lat);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ') + ' Z';
}

function geoToPathD(geo) {
  if (!geo) return '';
  const parts = [];
  const features = geo.features ?? [geo];
  for (const feat of features) {
    const geom = feat.geometry ?? feat;
    if (geom.type === 'Polygon') {
      for (const ring of geom.coordinates) parts.push(ringToPath(ring));
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.coordinates) {
        for (const ring of poly) parts.push(ringToPath(ring));
      }
    }
  }
  return parts.join(' ');
}

const PAGE_SIZE = 5;

export default function ProjectsClient({ projects }) {
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [hoveredSlug, setHoveredSlug]     = useState(null);
  const [moroccoGeo, setMoroccoGeo]       = useState(null);
  const [page, setPage]                   = useState(0);

  useEffect(() => {
    fetch('/data/morocco.geojson').then(r => r.json()).then(setMoroccoGeo);
  }, []);

  const allTypes = [...new Set(projects.map(p => p.projectType).filter(Boolean))];
  const isFiltered = activeFilters.size > 0;
  const filtered = isFiltered
    ? projects.filter(p => activeFilters.has(p.projectType))
    : projects;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleFilter = (type) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
    setPage(0);
  };

  // Dots are driven by all projects (not the paginated slice)
  const geoProjects    = projects.filter(p => p.latitude != null && p.longitude != null);
  const hoveredProject = hoveredSlug ? projects.find(p => p.slug === hoveredSlug) : null;
  const bgSrc          = ctfImage(hoveredProject?.coverImage?.url ?? null, { width: 1200 });
  const showBg         = hoveredSlug !== null && bgSrc !== null;
  const mapPathD       = geoToPathD(moroccoGeo);

  return (
    <>
      <style>{`
        .pc-container {
          padding: 0;
        }

        /* ── Dark filter button overrides ── */
        .filter-btn {
          border: 1.5px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.6);
          background: transparent;
        }
        .filter-btn:hover {
          border-color: rgba(255,255,255,0.4);
          color: #ffffff;
        }
        .filter-btn.active {
          background: #0066cc;
          color: #fff;
          border-color: #0066cc;
        }
        .filter-label { color: rgba(255,255,255,0.35) !important; }

        /* ── Type-coloured filter buttons ── */
        .filter-btn.filter-btn-type {
          border-color: var(--tc);
          color: var(--tc);
        }
        .filter-btn.filter-btn-type:hover:not(.active) {
          background: var(--tc-bg);
          border-color: var(--tc);
          color: var(--tc);
        }
        .filter-btn.filter-btn-type.active {
          background: var(--tc);
          color: #ffffff;
          border-color: var(--tc);
        }

        /* ── Grid wrapper — full-bleed dark band ── */
        .pc-grid-wrap {
          position: relative;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          overflow: clip;
          background: linear-gradient(135deg, #0a1628 0%, #0e2340 100%);
          padding-top: 3.5rem;
          padding-bottom: 2.5rem;
        }

        /* ── Full-bleed hover image ── */
        .pc-hover-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          filter: brightness(1.3);
          border-radius: 10px;
          transition: opacity 0.4s ease;
          -webkit-mask-image: linear-gradient(to right,
            transparent 0%,
            transparent 22%,
            rgba(0,0,0,0.5) 38%,
            rgba(0,0,0,0.9) 55%,
            black 65%
          );
          mask-image: linear-gradient(to right,
            transparent 0%,
            transparent 22%,
            rgba(0,0,0,0.5) 38%,
            rgba(0,0,0,0.9) 55%,
            black 65%
          );
        }

        /* ── Dark tint ── */
        .pc-hover-tint {
          position: absolute;
          inset: 0;
          z-index: 1;
          border-radius: 10px;
          background: linear-gradient(to right, rgba(10,22,40,0.9) 5%, rgba(10,22,40,0.45) 15%, rgba(10,22,40,0.7) 30%);
          pointer-events: none;
          transition: opacity 0.4s ease;
        }

        /* ── Filter bar (inside dark band) ── */
        .pc-filter-inner {
          position: relative;
          z-index: 2;
          padding: 0 2.5rem 1rem;
        }

        /* ── Split grid ── */
        .pc-split-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
          padding: 0 2.5rem 1rem;
        }

        /* ── Project list ── */
        .pc-list { list-style: none; padding: 0; margin: 0; }
        .pc-item { border-top: 1px solid rgba(255,255,255,0.08); }
        .pc-item:last-child { border-bottom: 1px solid rgba(255,255,255,0.08); }
        .pc-item-inner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem 0;
          text-decoration: none;
          color: inherit;
        }
        .pc-item-num {
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.25);
          min-width: 2rem;
        }
        .pc-item-info { flex: 1; display: flex; flex-direction: column; gap: 0.18rem; }
        .pc-item-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1rem, 1.7vw, 1.38rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #ffffff;
          transition: color 0.2s;
          line-height: 1.1;
        }
        .pc-item:hover .pc-item-title,
        .pc-item:focus-within .pc-item-title { color: #00a3ff; }
        .pc-item-meta {
          font-size: 0.68rem;
          color: rgba(255,255,255,0.4);
          transition: color 0.2s;
          display: flex;
          gap: 0.6rem;
        }
        .pc-item:hover .pc-item-meta,
        .pc-item:focus-within .pc-item-meta { color: rgba(255,255,255,0.65); }
        .pc-item-right {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }
        .pc-item-badge {
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.18rem 0.5rem;
          border-radius: 2px;
          transition: filter 0.18s;
        }
        .pc-item:hover .pc-item-badge { filter: brightness(1.25); }
        .pc-arrow {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          transition: color 0.2s, transform 0.2s;
        }
        .pc-item:hover .pc-arrow { color: #00a3ff; transform: translateX(5px); }
        .pc-empty {
          padding: 4rem 0;
          color: rgba(255,255,255,0.35);
          font-size: 0.9rem;
        }

        /* ── Pagination ── */
        .pc-pagination {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 0.75rem;
        }
        .pc-page-btn {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          font-size: 1rem;
          transition: border-color 0.18s, color 0.18s;
        }
        .pc-page-btn:hover:not(:disabled) {
          border-color: #00a3ff;
          color: #00a3ff;
        }
        .pc-page-btn:disabled {
          opacity: 0.3;
          cursor: default;
        }
        .pc-page-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
        }

        /* ── Map column ── */
        .pc-map-sticky {
          position: sticky;
          top: 100px;
          z-index: 2;
        }
        .pc-map-block {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }
        .pc-map-svg {
          position: relative;
          z-index: 2;
          display: block;
          width: 100%;
          max-height: calc(100vh - 220px);
          height: auto;
          margin: 0 auto;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .pc-split-grid { grid-template-columns: 1fr; }
          .pc-map-sticky { position: static; order: -1; z-index: 2; }
          .pc-map-block { height: 320px; }
          .pc-map-svg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            max-height: none;
          }
          .pc-hover-img {
            -webkit-mask-image: linear-gradient(to bottom,
              transparent 0%,
              rgba(0,0,0,0.85) 60%,
              black 100%
            );
            mask-image: linear-gradient(to bottom,
              transparent 0%,
              rgba(0,0,0,0.85) 60%,
              black 100%
            );
          }
        }
        @media (max-width: 860px) {
          .pc-filter-inner { padding: 0 1.25rem 1rem; }
          .pc-split-grid   { padding: 0 1.25rem 1rem; }
        }
      `}</style>

      <div className="pc-container">
        <div className="pc-grid-wrap">

          {/* Full-bleed cover image */}
          <img
            src={bgSrc ?? undefined}
            alt=""
            aria-hidden="true"
            className="pc-hover-img"
            style={{ opacity: showBg ? 1 : 0 }}
          />

          {/* Dark tint */}
          <div
            className="pc-hover-tint"
            style={{ opacity: showBg ? 1 : 0 }}
          />

          {/* Filter bar — inside the dark card */}
          <div className="pc-filter-inner">
            <div className="filter-bar">
              <span className="filter-label">Type :</span>
              <button
                type="button"
                className={`filter-btn${activeFilters.size === 0 ? ' active' : ''}`}
                onClick={() => { setActiveFilters(new Set()); setPage(0); }}
              >
                Tous
              </button>
              {allTypes.map(type => {
                const c = TYPE_COLORS[type] ?? '#00a3ff';
                return (
                  <button
                    key={type}
                    type="button"
                    className={`filter-btn filter-btn-type${activeFilters.has(type) ? ' active' : ''}`}
                    style={{ '--tc': c, '--tc-bg': `${c}1A` }}
                    onClick={() => toggleFilter(type)}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two-column grid */}
          <div className="pc-split-grid">

            {/* Left: paginated project list */}
            <div style={{ paddingLeft: '0.5rem' }}>
              {filtered.length > 0 ? (
                <>
                  <ul className="pc-list">
                    {pageItems.map((p, i) => {
                      const badgeLabel = p.projectType || p.category;
                      const badgeColor = TYPE_COLORS[p.projectType] ?? '#00a3ff';
                      return (
                        <li
                          key={p.slug}
                          className="pc-item"
                          onMouseEnter={() => setHoveredSlug(p.slug)}
                          onMouseLeave={() => setHoveredSlug(null)}
                        >
                          <Link href={`/realisations/${p.slug}`} className="pc-item-inner">
                            <span className="pc-item-num">
                              {String(page * PAGE_SIZE + i + 1).padStart(2, '0')}
                            </span>
                            <div className="pc-item-info">
                              <span className="pc-item-title">{p.title}</span>
                              <div className="pc-item-meta">
                                {p.region && <span>{p.region}</span>}
                                {p.client && <span>{p.client}</span>}
                                {p.year   && <span>{p.year}</span>}
                              </div>
                            </div>
                            <div className="pc-item-right">
                              {p.model?.url && <Badge3D variant="dark" />}
                              {badgeLabel && (
                                <span
                                  className="pc-item-badge"
                                  style={{
                                    border:     `1px solid ${badgeColor}`,
                                    color:       badgeColor,
                                    background: `${badgeColor}1A`,
                                  }}
                                >
                                  {badgeLabel}
                                </span>
                              )}
                              <span className="pc-arrow">→</span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pc-pagination">
                      <button
                        type="button"
                        className="pc-page-btn"
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 0}
                        aria-label="Page précédente"
                      >
                        ‹
                      </button>
                      <span className="pc-page-label">{page + 1} / {totalPages}</span>
                      <button
                        type="button"
                        className="pc-page-btn"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === totalPages - 1}
                        aria-label="Page suivante"
                      >
                        ›
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="pc-empty">Aucun projet pour ce filtre.</div>
              )}
            </div>

            {/* Right: sticky SVG map — dots show ALL filtered projects, not just this page */}
            <div className="pc-map-sticky">
              <div className="pc-map-block">
                <svg
                  viewBox="0 0 440 640"
                  className="pc-map-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    filter:     hoveredSlug ? 'drop-shadow(0 0 6px rgba(0,0,0,0.4))' : 'none',
                    transition: 'filter 0.3s ease',
                  }}
                >
                  {mapPathD && (
                    <path
                      d={mapPathD}
                      style={{
                        fill:        hoveredSlug ? 'rgba(10,22,40,0.35)' : 'rgba(255,255,255,0.04)',
                        stroke:      '#ffffff',
                        strokeWidth: hoveredSlug ? 2 : 1.5,
                        transition:  'fill 0.3s ease, stroke-width 0.3s ease',
                      }}
                    />
                  )}
                  {geoProjects.map(p => {
                    const [cx, cy] = proj(p.longitude, p.latitude);
                    const color = TYPE_COLORS[p.projectType] ?? '#0066cc';
                    const filteredOut = isFiltered && !activeFilters.has(p.projectType);
                    const isHovered   = hoveredSlug === p.slug;
                    const otherHover  = hoveredSlug !== null && !isHovered;

                    let fillOpacity;
                    if (filteredOut)     fillOpacity = 0.12;
                    else if (isHovered)  fillOpacity = 1;
                    else if (otherHover) fillOpacity = 0.25;
                    else                 fillOpacity = 0.85;

                    return (
                      <g key={p.slug}>
                        {isHovered && (
                          <circle
                            cx={cx.toFixed(2)}
                            cy={cy.toFixed(2)}
                            r={14}
                            fill="none"
                            stroke={color}
                            strokeWidth={2}
                            opacity={0.5}
                          />
                        )}
                        <circle
                          cx={cx.toFixed(2)}
                          cy={cy.toFixed(2)}
                          r={isHovered ? 10 : 6}
                          fill={color}
                          fillOpacity={fillOpacity}
                          stroke="#fff"
                          strokeWidth="1.5"
                          style={{ transition: 'r 0.25s ease, fill-opacity 0.25s ease' }}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
