import Link from 'next/link';
import { getAllProjects } from '@/lib/api';
import ProjectsClient from '@/components/realisations/ProjectsClient';
import ScrollReveal from '@/components/layout/ScrollReveal';
import SectionScrollBar from '@/components/layout/SectionScrollBar';

const CATEGORY_BG = {
  Distribution: 'linear-gradient(135deg, #0a1628, #0d2040)',
  'Éclairage': 'linear-gradient(135deg, #003d7a, #005fa3)',
  Solaire: 'linear-gradient(135deg, #005fa3, #0079cc)',
  VRD: 'linear-gradient(135deg, #0a1628, #0f1e35)',
};
const DEFAULT_BG = 'linear-gradient(135deg, #0a1628, #162540)';

export default async function RealisationsPage() {
  const items = await getAllProjects();
  const projects = items.map((item) => ({
    slug: item.slug,
    title: item.title,
    category: item.category,
    region: item.region,
    client: item.client,
    year: item.year,
    featured: item.featured ?? false,
    coverImage: item.coverImage ?? null,
  }));

  const featured = projects.find((p) => p.featured) ?? null;

  const SECTIONS_BASE = [
    { id: 'real-hero', label: 'Intro' },
    { id: 'real-grid', label: 'Projets' },
    { id: 'real-cta',  label: 'Contact' },
  ];
  const SECTIONS = featured
    ? [
        { id: 'real-hero',  label: 'Intro' },
        { id: 'real-grid',  label: 'Projets' },
        { id: 'real-phare', label: 'Phare' },
        { id: 'real-cta',   label: 'Contact' },
      ]
    : SECTIONS_BASE;

  return (
    <>
      <SectionScrollBar sections={SECTIONS} />
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
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(10,22,40,0.35);
        }
        .empty-state p {
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        /* FEATURED PROJECT */
        .featured-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3.5rem;
          align-items: center;
        }
        .featured-thumb {
          height: 360px;
          border-radius: 8px;
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .featured-thumb::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,22,40,0.5) 0%, transparent 60%);
        }
        .featured-badge {
          position: relative;
          z-index: 1;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: #00a3ff;
          color: #ffffff;
          padding: 0.3rem 0.8rem;
          border-radius: 3px;
        }
        .featured-content h3 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #0a1628;
          margin-bottom: 1.25rem;
          line-height: 1.1;
        }
        .featured-specs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
          margin-bottom: 2rem;
        }
        .spec-item {
          background: #f0f5ff;
          border-radius: 6px;
          padding: 1rem 1.25rem;
        }
        .spec-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(10,22,40,0.38);
          margin-bottom: 0.3rem;
        }
        .spec-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #0a1628;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .proj-full-grid { grid-template-columns: repeat(2, 1fr); }
          .featured-grid { grid-template-columns: 1fr; gap: 2rem; }
          .featured-thumb { height: 260px; }
        }
        @media (max-width: 640px) {
          .proj-full-grid { grid-template-columns: 1fr; }
          .filter-bar { gap: 0.4rem; }
        }
      `}</style>

      {/* ── PAGE HERO ── */}
      <section className="page-hero" data-section="real-hero">
        <div className="page-hero-inner">
          <div className="page-hero-label">Portfolio</div>
          <h1>Nos Projets<br />Livrés</h1>
          <p>Plus de 500 réalisations à travers les 12 régions du Maroc. Distribution, éclairage, solaire et génie civil.</p>
        </div>
      </section>

      {/* ── FILTER + GRID (client — handles filter state) ── */}
      <div data-section="real-grid">
        <ProjectsClient projects={projects} />
      </div>

      {/* ── PROJET PHARE ── */}
      {featured && (
        <section className="section-surface" data-section="real-phare">
          <div className="container">
            <ScrollReveal>
              <div className="section-header">
                <span className="overline">Projet Phare</span>
                <h2>Réalisation en Vedette</h2>
                <p>Un projet représentatif de notre savoir-faire technique et de notre capacité d&apos;organisation.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left">
            <div className="featured-grid">
              <div
                className="featured-thumb"
                style={{
                  background: featured.coverImage
                    ? `url(${featured.coverImage.url}) center/cover no-repeat`
                    : (CATEGORY_BG[featured.category] ?? DEFAULT_BG),
                }}
              >
                <span className="featured-badge">Projet Phare — {featured.category}</span>
              </div>
              <div className="featured-content">
                <span className="overline">{featured.region} · {featured.year}</span>
                <h3>{featured.title}</h3>
                <div className="featured-specs">
                  {[
                    { label: "Maître d'Ouvrage", val: featured.client },
                    { label: 'Région', val: featured.region },
                    { label: 'Année', val: featured.year },
                    { label: 'Catégorie', val: featured.category },
                  ].map((s) => (
                    <div className="spec-item" key={s.label}>
                      <div className="spec-label">{s.label}</div>
                      <div className="spec-val">{s.val}</div>
                    </div>
                  ))}
                </div>
                <Link href={`/realisations/${featured.slug}`} className="btn btn-primary">
                  Voir le Projet →
                </Link>
              </div>
            </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="section-dark" data-section="real-cta" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#00a3ff,#0066cc)' }} />
        <div className="container">
          <span className="overline">Bureau d&apos;Études</span>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Vous avez un Projet ?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '460px', margin: '0 auto 2.5rem', lineHeight: '1.75' }}>
            Partagez votre cahier des charges. Notre bureau d&apos;études vous répond sous 48h.
          </p>
          <Link href="/contact" className="btn btn-primary">Nous Contacter</Link>
        </div>
      </section>
    </>
  );
}
