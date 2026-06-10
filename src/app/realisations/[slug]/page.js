import Link from 'next/link';
import { notFound } from 'next/navigation';
import SectionScrollBar from '@/components/layout/SectionScrollBar';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { contentfulClient } from '@/lib/contentful';
import { GET_ALL_PROJECTS, GET_PROJECT_BY_SLUG } from '@/lib/queries';

const CATEGORY_BG = {
  Distribution: 'linear-gradient(135deg, #0a1628, #0d2040)',
  'Éclairage': 'linear-gradient(135deg, #003d7a, #005fa3)',
  Solaire: 'linear-gradient(135deg, #005fa3, #0079cc)',
  VRD: 'linear-gradient(135deg, #0a1628, #0f1e35)',
};
const DEFAULT_BG = 'linear-gradient(135deg, #0a1628, #162540)';

export async function generateStaticParams() {
  const data = await contentfulClient.request(GET_ALL_PROJECTS);
  return data.projectCollection.items.map((item) => ({ slug: item.slug }));
}

const SECTIONS = [
  { id: 'detail-hero',    label: 'Projet' },
  { id: 'detail-content', label: 'Détails' },
  { id: 'detail-cta',     label: 'Contact' },
];

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const data = await contentfulClient.request(GET_PROJECT_BY_SLUG, { slug });
  const raw = data.projectCollection.items[0];

  if (!raw) notFound();

  const project = {
    title: raw.title,
    slug: raw.slug,
    category: raw.category,
    region: raw.region,
    client: raw.client,
    year: raw.year,
    description: raw.description ?? null,
    budget: raw.budget ?? null,
    duration: raw.duration ?? null,
    specs: raw.specs?.json ?? null,
    featured: raw.featured ?? false,
    coverImage: raw.coverImage ?? null,
  };

  const heroBg = project.coverImage
    ? `url(${project.coverImage.url}) center/cover no-repeat`
    : (CATEGORY_BG[project.category] ?? DEFAULT_BG);

  const specItems = [
    { label: "Maître d'Ouvrage", val: project.client },
    { label: 'Région', val: project.region },
    { label: 'Année', val: project.year },
    ...(project.budget ? [{ label: 'Budget', val: project.budget }] : []),
    ...(project.duration ? [{ label: 'Durée', val: project.duration }] : []),
    { label: 'Catégorie', val: project.category },
  ];

  return (
    <>
      <SectionScrollBar sections={SECTIONS} />
      <style>{`
        .detail-hero {
          min-height: 380px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 5rem 2.5rem 3rem;
          position: relative;
          overflow: hidden;
        }
        .detail-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,22,40,0.78) 0%, rgba(10,22,40,0.3) 55%, transparent 100%);
          z-index: 0;
        }
        .detail-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .detail-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          margin-bottom: 1.5rem;
          transition: color 0.2s;
        }
        .detail-back:hover { color: #ffffff; }
        .detail-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: rgba(0,163,255,0.9);
          color: #ffffff;
          padding: 0.3rem 0.8rem;
          border-radius: 3px;
          margin-bottom: 1rem;
        }
        .detail-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: #ffffff;
          line-height: 1.1;
          max-width: 700px;
        }

        /* CONTENT LAYOUT */
        .detail-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 3.5rem;
          align-items: start;
        }
        .detail-section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #0a1628;
          margin: 0.5rem 0 1.25rem;
          letter-spacing: 0.02em;
        }
        .detail-desc {
          font-size: 1rem;
          color: rgba(10,22,40,0.68);
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }
        .detail-specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .detail-spec {
          background: #f0f5ff;
          border-radius: 6px;
          padding: 1rem 1.25rem;
        }
        .detail-spec-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(10,22,40,0.38);
          margin-bottom: 0.3rem;
        }
        .detail-spec-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0a1628;
        }
        .detail-extra {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(10,22,40,0.07);
          font-size: 0.9rem;
          color: rgba(10,22,40,0.6);
          line-height: 1.75;
        }

        /* SIDEBAR */
        .detail-sidebar { position: sticky; top: 100px; }
        .detail-sidebar-card {
          background: #0a1628;
          border-radius: 8px;
          padding: 2rem;
          color: #ffffff;
        }
        .detail-sidebar-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.75rem;
        }
        .detail-sidebar-body {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 1024px) {
          .detail-layout { grid-template-columns: 1fr; }
          .detail-sidebar { position: static; }
          .detail-hero { padding: 4rem 1.25rem 2.5rem; }
        }
        @media (max-width: 640px) {
          .detail-specs-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="detail-hero" data-section="detail-hero" style={{ background: heroBg }}>
        <div className="detail-hero-inner">
          <Link href="/realisations" className="detail-back">
            ← Retour aux Réalisations
          </Link> 
          <h1 className="detail-title">{project.title}</h1>
          <div className="detail-badge">{project.category}</div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="section" data-section="detail-content">
        <div className="container">
          <div className="detail-layout">
            {/* Main column */}
            <div>
              <span className="overline">{project.region} · {project.year}</span>

              {project.description && (
                <>
                  <h2 className="detail-section-title">À propos du projet</h2>
                  <p className="detail-desc">{project.description}</p>
                </>
              )}

              <span className="overline">Fiche Technique</span>
              <div className="detail-specs-grid" style={{ marginTop: '0.75rem' }}>
                {specItems.map((s) => (
                  <div className="detail-spec" key={s.label}>
                    <div className="detail-spec-label">{s.label}</div>
                    <div className="detail-spec-val">{s.val}</div>
                  </div>
                ))}
              </div>

              {project.specs && (
                <div className="detail-extra">
                  {documentToReactComponents(project.specs)}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="detail-sidebar">
              <div className="detail-sidebar-card">
                <div className="detail-sidebar-title">Projet similaire ?</div>
                <p className="detail-sidebar-body">
                  Vous avez un projet d&apos;infrastructure électrique ou énergétique ? Notre bureau d&apos;études vous répond sous 48h.
                </p>
                <Link
                  href="/contact"
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center', display: 'block' }}
                >
                  Nous Contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-dark" data-section="detail-cta" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#00a3ff,#0066cc)' }} />
        <div className="container">
          <span className="overline">Portfolio</span>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Découvrez nos autres Réalisations</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '460px', margin: '0 auto 2.5rem', lineHeight: '1.75' }}>
            Plus de 500 projets livrés à travers les 12 régions du Maroc.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/realisations" className="btn btn-primary">Tous nos Projets</Link>
            <Link href="/contact" className="btn btn-outline-white">Demander un Devis</Link>
          </div>
        </div>
      </section>
    </>
  );
}
