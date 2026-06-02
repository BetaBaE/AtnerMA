import Link from 'next/link';
import { getAllProjects } from '@/lib/api';
import ProjectsClient from '@/components/realisations/ProjectsClient';

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

  return (
    <>
      <style>{`
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
          .featured-grid { grid-template-columns: 1fr; gap: 2rem; }
          .featured-thumb { height: 260px; }
        }
      `}</style>

      {/* ── PAGE HERO ── */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="page-hero-label">Portfolio</div>
          <h1>Nos Projets<br />Livrés</h1>
          <p>Plus de 500 réalisations à travers les 12 régions du Maroc. Distribution, éclairage, solaire et génie civil.</p>
        </div>
      </section>

      {/* ── PROJECTS GRID (client — handles filter state) ── */}
      <ProjectsClient projects={projects} />

      {/* ── PROJET PHARE ── */}
      {featured && (
        <section className="section-surface">
          <div className="container">
            <div className="section-header">
              <span className="overline">Projet Phare</span>
              <h2>Réalisation en Vedette</h2>
              <p>Un projet représentatif de notre savoir-faire technique et de notre capacité d&apos;organisation.</p>
            </div>
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
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="section-dark" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
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
