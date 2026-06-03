import Link from 'next/link';
import { getSiteConfig, getAllActivities, getFeaturedProjects } from '@/lib/api';
import StatsCounter from '@/components/home/StatsCounter';
import YearIntro from '@/components/home/YearIntro';
import ActivityCard from '@/components/home/ActivityCard';
import ScrollReveal from '@/components/layout/ScrollReveal';

const CATEGORY_BG = {
  Distribution: 'linear-gradient(135deg, #0a1628, #0d2040)',
  'Éclairage': 'linear-gradient(135deg, #003d7a, #005fa3)',
  Solaire: 'linear-gradient(135deg, #005fa3, #0079cc)',
  VRD: 'linear-gradient(135deg, #0a1628, #0f1e35)',
};

const clients = [
  { name: 'ONEE', full: "Office National de l'Électricité et de l'Eau Potable" },
  { name: 'MASEN', full: 'Moroccan Agency for Sustainable Energy' },
  { name: 'Min. Équipement', full: "Ministère de l'Équipement et de l'Eau" },
  { name: 'Communes Urbaines', full: 'Collectivités Territoriales' },
  { name: 'CRI', full: "Centres Régionaux d'Investissement" },
  { name: 'MCA Maroc', full: 'Millennium Challenge Account Morocco' },
];

const ActivityIcon = ({ id }) => {
  const props = { viewBox: '0 0 24 24', fill: 'none', stroke: 'white', strokeWidth: '1.75', strokeLinecap: 'round', strokeLinejoin: 'round', width: 20, height: 20 };
  if (id === 'distribution') return (
    <svg {...props}><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  );
  if (id === 'eclairage') return (
    <svg {...props}><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
  );
  if (id === 'solaire') return (
    <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
  );
  return (
    <svg {...props}><rect x="3" y="11" width="18" height="10" rx="1" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><line x1="12" y1="15" x2="12" y2="17" strokeWidth="2" /></svg>
  );
};

export default async function HomePage() {
  const [config, activities, featuredItems] = await Promise.all([
    getSiteConfig(),
    getAllActivities(),
    getFeaturedProjects(),
  ]);

  const recentProjects = featuredItems.map((item) => ({
    slug: item.slug,
    title: item.title,
    category: item.category,
    region: item.region,
    client: item.client,
    thumbBg: item.coverImage
      ? `url(${item.coverImage.url}) center/cover no-repeat`
      : (CATEGORY_BG[item.category] ?? 'linear-gradient(135deg, #0a1628, #162540)'),
  }));

  return (
    <>
      <style>{`
        .home-hero {
          min-height: calc(100vh - 72px);
          background:
            radial-gradient(ellipse 80% 60% at 72% 50%, rgba(0,163,255,0.08) 0%, transparent 60%),
            #0a1628;
          display: flex;
          align-items: center;
          padding: 6rem 2.5rem 5rem;
          position: relative;
          overflow: hidden;
        }
        .hero-hex {
          position: absolute;
          right: -60px;
          top: 50%;
          transform: translateY(-50%);
          width: 560px;
          height: 560px;
          background: linear-gradient(135deg, rgba(0,163,255,0.05), rgba(0,102,204,0.04));
          clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
          pointer-events: none;
        }
        .hero-hex-sm {
          position: absolute;
          right: 240px;
          top: -80px;
          width: 240px;
          height: 240px;
          background: rgba(0,163,255,0.035);
          clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
          pointer-events: none;
        }
        .hero-inner { max-width: 1200px; margin: 0 auto; width: 100%; }
        .hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #00a3ff;
          margin-bottom: 1.5rem;
        }
        .hero-kicker::before {
          content: '';
          display: block;
          width: 28px;
          height: 2px;
          background: #00a3ff;
        }
        .hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 800;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: #ffffff;
          line-height: 1.03;
          margin-bottom: 1.5rem;
          max-width: 680px;
        }
        .hero-title .hl { color: #00a3ff; }
        .hero-sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.75;
          max-width: 460px;
          margin-bottom: 2.75rem;
        }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

        /* Activity cards */
        .act-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .act-card {
          background: #ffffff;
          border: 1px solid rgba(10,22,40,0.07);
          border-top: 3px solid #00a3ff;
          border-radius: 6px;
          padding: 2rem 1.75rem;
          transition: transform 0.22s, box-shadow 0.22s;
          text-decoration: none;
          display: block;
          color: inherit;
        }
        .act-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 56px rgba(10,22,40,0.1);
        }
        .act-icon {
          width: 46px;
          height: 46px;
          background: linear-gradient(135deg, #00a3ff, #0066cc);
          clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .act-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #0a1628;
          margin-bottom: 0.7rem;
          line-height: 1.2;
        }
        .act-desc {
          font-size: 0.88rem;
          color: rgba(10,22,40,0.55);
          line-height: 1.65;
        }
        .act-more {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #00a3ff;
          margin-top: 1.25rem;
        }

        /* Project cards */
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .proj-card {
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(10,22,40,0.07);
          transition: transform 0.22s, box-shadow 0.22s;
          text-decoration: none;
          display: block;
          color: inherit;
        }
        .proj-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 56px rgba(10,22,40,0.12);
        }
        .proj-thumb {
          height: 180px;
          display: flex;
          align-items: flex-end;
          padding: 1rem;
        }
        .proj-badge {
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
        .proj-body { padding: 1.5rem; background: #ffffff; }
        .proj-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #0a1628;
          margin-bottom: 0.85rem;
          line-height: 1.25;
        }
        .proj-meta { display: flex; flex-direction: column; gap: 0.35rem; }
        .proj-meta-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.82rem;
          color: rgba(10,22,40,0.5);
        }
        .proj-meta-row svg {
          width: 13px;
          height: 13px;
          stroke: #00a3ff;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          flex-shrink: 0;
        }

        /* Client pills */
        .clients-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
          justify-content: center;
        }
        .client-pill {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0a1628;
          padding: 0.65rem 1.5rem;
          border: 1.5px solid rgba(10,22,40,0.1);
          border-radius: 4px;
          background: #ffffff;
          transition: border-color 0.2s, color 0.2s;
          cursor: default;
        }
        .client-pill:hover { border-color: #00a3ff; color: #00a3ff; }

        /* CTA band */
        .cta-band {
          background: linear-gradient(135deg, #0a1628 0%, #0e2340 100%);
          padding: 5.5rem 2.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-band::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #00a3ff, #0066cc);
        }
        .cta-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #ffffff;
          letter-spacing: 0.02em;
          margin-bottom: 1rem;
        }
        .cta-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          margin: 0 auto 2.5rem;
          line-height: 1.75;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .act-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 860px) {
          .home-hero { padding: 5rem 1.25rem 4rem; }
          .hero-hex, .hero-hex-sm { display: none; }
          .proj-grid { grid-template-columns: 1fr; }
          .cta-band { padding: 4rem 1.25rem; }
        }
        @media (max-width: 580px) {
          .act-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <YearIntro />

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="hero-hex" aria-hidden="true" />
        <div className="hero-hex-sm" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-kicker">BTP &amp; Énergie · Maroc</div>
          <h1 className="hero-title">{config?.heroTitle ?? 'Infrastructures Énergétiques pour le Maroc'}</h1>
          <p className="hero-sub">{config?.heroSubtitle ?? ''}</p>
          <div className="hero-actions">
            <Link href="/contact" className="btn btn-primary">{config?.heroCtaLabel ?? 'Nous Contacter'}</Link>
            <Link href="/realisations" className="btn btn-outline-white">Voir nos Réalisations →</Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <StatsCounter
        projectsCount={config?.projectsCount ?? '500+'}
        yearsCount={config?.yearsCount ?? '20+'}
        regionsCount={config?.regionsCount ?? '12'}
      />

      {/* ── ACTIVITÉS ── */}
      <section className="section-surface">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="overline">Nos Expertises</span>
              <h2>Nos Domaines d&apos;Activité</h2>
              <p>Des prestations complètes en électricité, énergie renouvelable et génie civil pour les marchés publics marocains.</p>
            </div>
          </ScrollReveal>
          <div className="act-grid">
            {activities.map((a, i) => (
              <ScrollReveal key={a.slug} delay={i * 0.1}>
                <ActivityCard
                  activity={a}
                  href={`/activites#${a.slug}`}
                  icon={<ActivityIcon id={a.icon} />}
                />
              </ScrollReveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/activites" className="btn btn-outline-navy">Toutes nos Activités →</Link>
          </div>
        </div>
      </section>

      {/* ── RÉALISATIONS RÉCENTES ── */}
      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="overline">Références</span>
              <h2>Réalisations Récentes</h2>
              <p>Quelques projets représentatifs livrés récemment à travers le territoire national.</p>
            </div>
          </ScrollReveal>
          <div className="proj-grid">
            {recentProjects.map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 0.1} direction="up">
                <Link href={`/realisations/${p.slug}`} className="proj-card">
                  <div className="proj-thumb" style={{ background: p.thumbBg }}>
                    <span className="proj-badge">{p.category}</span>
                  </div>
                  <div className="proj-body">
                    <div className="proj-title">{p.title}</div>
                    <div className="proj-meta">
                      <div className="proj-meta-row">
                        <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        {p.region}
                      </div>
                      <div className="proj-meta-row">
                        <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
                        {p.client}
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/realisations" className="btn btn-outline-navy">Voir tous nos Projets →</Link>
          </div>
        </div>
      </section>

      {/* ── CLIENTS ── */}
      <section className="section-surface">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="overline">Confiance</span>
            <h2>Nos Clients Publics</h2>
            <p>Nous travaillons aux côtés des grands donneurs d&apos;ordres publics du Royaume.</p>
          </div>
          <ScrollReveal direction="up">
            <div className="clients-row">
              {clients.map((c) => (
                <div className="client-pill" key={c.name} title={c.full}>{c.name}</div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-band">
        <div className="container">
          <ScrollReveal direction="scale">
            <div className="cta-title">Discutons de votre Projet</div>
            <p className="cta-sub">
              Notre Bureau d&apos;Études vous accompagne de la phase AO jusqu&apos;à la réception définitive.
            </p>
            <Link href="/contact" className="btn btn-primary">Contactez notre Bureau d&apos;Études</Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
