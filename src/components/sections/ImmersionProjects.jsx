'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ctfImage } from '@/lib/contentful-image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

function petalImage(project) {
  return project.coverImage?.url ?? project.gallery?.items?.[0]?.url ?? null;
}

export default function ImmersionProjects({ projects }) {
  const [active, setActive] = useState(0);

  const items = (projects ?? []).slice(0, 5);

  useEffect(() => {
    items.forEach((p) => {
      const src = petalImage(p);
      if (src) { const img = new window.Image(); img.src = ctfImage(src, { width: 1000 }); }
    });
  }, [items]);

  if (!projects?.length) return null;

  const handleKeyDown = (e, i) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActive(i);
    }
  };

  return (
    <section className="section" data-section="immersion">
      <style>{`
        .immersion-strip {
          display: flex;
          height: 540px;
          gap: 0.5rem;
        }
        .immersion-petal {
          position: relative;
          flex: 0 1 12%;
          min-width: 0;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: none;
          padding: 0;
          margin: 0;
          background-color: #0a1628;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: flex-basis 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.4s ease, box-shadow 0.3s ease;
          text-align: left;
        }
        .immersion-petal.is-active {
          flex: 1 1 56%;
        }
        .immersion-petal.is-collapsed {
          flex: 0 1 12%;
          filter: saturate(0.65) brightness(0.8);
        }
        .immersion-petal.is-collapsed:hover {
          filter: saturate(1) brightness(1);
          box-shadow: 0 0 24px rgba(0,163,255,0.45);
        }
        .immersion-petal.is-active::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          box-shadow: inset 0 0 60px rgba(0,163,255,0.25), 0 0 40px rgba(0,163,255,0.35);
          pointer-events: none;
          opacity: 0;
          animation: immersionGlow 0.6s ease 0.2s forwards;
        }
        @keyframes immersionGlow {
          to { opacity: 1; }
        }
        .immersion-petal:focus-visible {
          outline: 2px solid #00a3ff;
          outline-offset: -2px;
        }
        .immersion-placeholder {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0a1628, #162540);
        }
        .immersion-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2rem;
          background: linear-gradient(to top, rgba(10,22,40,0.9) 0%, rgba(10,22,40,0.4) 45%, transparent 75%);
          opacity: 0;
          visibility: hidden;
          transform: scale(0.92);
          transform-origin: bottom left;
          pointer-events: none;
          transition: opacity 0.45s ease 0.25s, transform 0.45s cubic-bezier(0.34,1.3,0.64,1) 0.25s, visibility 0s linear 0.7s;
        }
        .immersion-petal.is-active .immersion-overlay {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
          pointer-events: auto;
          transition: opacity 0.45s ease 0.25s, transform 0.45s cubic-bezier(0.34,1.3,0.64,1) 0.25s, visibility 0s;
        }
        .immersion-eyebrow {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #00a3ff;
          margin-bottom: 0.5rem;
          opacity: 0;
          transform: translateY(8px);
        }
        .immersion-petal.is-active .immersion-eyebrow {
          animation: immersionRise 0.5s ease 0.4s forwards;
        }
        .immersion-petal.is-active .immersion-title {
          animation: immersionRise 0.5s ease 0.5s forwards;
        }
        .immersion-petal.is-active .immersion-specs {
          animation: immersionRise 0.5s ease 0.6s forwards;
        }
        .immersion-petal.is-active .immersion-link {
          animation: immersionRise 0.5s ease 0.7s forwards;
        }
        @keyframes immersionRise {
          to { opacity: 1; transform: translateY(0); }
        }
        .immersion-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 0.85rem;
          opacity: 0;
          transform: translateY(8px);
        }
        .immersion-specs {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.82);
          line-height: 1.5;
          max-height: 150px;
          overflow-y: auto;
          opacity: 0;
          transform: translateY(8px);
        }
        .immersion-specs p {
          margin: 0 0 0.5rem;
        }
        .immersion-specs ul {
          margin: 0 0 0.5rem;
          padding-left: 1.1rem;
        }
        .immersion-specs li {
          margin-bottom: 0.25rem;
        }
        .immersion-specs b,
        .immersion-specs strong {
          color: #ffffff;
        }
        .immersion-link {
          display: inline-block;
          margin-top: 1rem;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #00a3ff;
          text-decoration: none;
          opacity: 0;
          transform: translateY(8px);
        }
        .immersion-link:hover {
          text-decoration: underline;
        }

        /* ── MOBILE ACCORDION ── */
        .immersion-accordion {
          display: none;
          flex-direction: column;
          gap: 0.5rem;
        }
        .immersion-card {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          border: none;
          padding: 0;
          margin: 0;
          width: 100%;
          background-color: #0a1628;
          background-size: cover;
          background-position: center;
          flex-basis: 72px;
          max-height: 72px;
          transition: flex-basis 0.5s ease, max-height 0.5s ease;
          text-align: left;
        }
        .immersion-card.is-active {
          flex-basis: 380px;
          max-height: 380px;
        }
        .immersion-card:focus-visible {
          outline: 2px solid #00a3ff;
          outline-offset: -2px;
        }
        .immersion-card-collapsed-row {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          height: 72px;
          padding: 0 1rem;
          background: linear-gradient(90deg, rgba(10,22,40,0.75), rgba(10,22,40,0.35));
        }
        .immersion-card.is-active .immersion-card-collapsed-row {
          display: none;
        }
        .immersion-card-collapsed-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #ffffff;
        }
        .immersion-card .immersion-overlay {
          padding: 1.5rem;
        }
        .immersion-card.is-active .immersion-overlay {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          transition: opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s;
        }

        @media (max-width: 767px) {
          .immersion-strip { display: none; }
          .immersion-accordion { display: flex; }
        }

        @media (prefers-reduced-motion: reduce) {
          .immersion-petal,
          .immersion-card,
          .immersion-overlay,
          .immersion-eyebrow,
          .immersion-title,
          .immersion-specs,
          .immersion-link {
            transition: none;
            animation: none;
            opacity: 1;
            transform: none;
          }
          .immersion-petal.is-active::after { animation: none; opacity: 1; }
        }
      `}</style>

      <div className="container">
        <div className="section-header">
          <span className="overline">Projets Phares</span>
          <h2>Nos Réalisations en Immersion</h2>
        </div>

        {/* ── DESKTOP PETAL STRIP ── */}
        <div className="immersion-strip">
          {items.map((project, i) => {
            const isActive = i === active;
            const src = petalImage(project);
            const url = src ? ctfImage(src, { width: 1000 }) : null;
            return (
              <button
                key={project.slug}
                type="button"
                className={`immersion-petal ${isActive ? 'is-active' : 'is-collapsed'}`}
                style={url ? { backgroundImage: `url(${url})` } : undefined}
                onClick={() => setActive(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                aria-expanded={isActive}
              >
                {!url && <div className="immersion-placeholder" />}
                <div className="immersion-overlay">
                  {project.typeDeProjet && (
                    <span className="immersion-eyebrow">{project.typeDeProjet}</span>
                  )}
                  <div className="immersion-title">{project.title}</div>
                  {project.specs?.json && (
                    <div className="immersion-specs">
                      {documentToReactComponents(project.specs.json)}
                    </div>
                  )}
                  <Link href={`/realisations/${project.slug}`} className="immersion-link">
                    Voir le projet →
                  </Link>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── MOBILE ACCORDION ── */}
        <div className="immersion-accordion">
          {items.map((project, i) => {
            const isActive = i === active;
            const src = petalImage(project);
            const url = src ? ctfImage(src, { width: 1000 }) : null;
            return (
              <button
                key={project.slug}
                type="button"
                className={`immersion-card ${isActive ? 'is-active' : ''}`}
                style={url ? { backgroundImage: `url(${url})` } : undefined}
                onClick={() => setActive(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                aria-expanded={isActive}
              >
                {!url && <div className="immersion-placeholder" />}
                <div className="immersion-card-collapsed-row">
                  <span className="immersion-card-collapsed-title">{project.title}</span>
                </div>
                <div className="immersion-overlay">
                  {project.typeDeProjet && (
                    <span className="immersion-eyebrow">{project.typeDeProjet}</span>
                  )}
                  <div className="immersion-title">{project.title}</div>
                  {project.specs?.json && (
                    <div className="immersion-specs">
                      {documentToReactComponents(project.specs.json)}
                    </div>
                  )}
                  <Link href={`/realisations/${project.slug}`} className="immersion-link">
                    Voir le projet →
                  </Link>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
