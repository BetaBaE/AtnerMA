import Link from 'next/link';
import { getAllActivities } from '@/lib/api';
import ActivityCard from '@/components/home/ActivityCard';
import ScrollReveal from '@/components/layout/ScrollReveal';

const steps = [
  { num: '01', title: "Appel d'Offres", desc: "Analyse du dossier AO, visite de site, préparation de l'offre technique et financière, dépôt dans les délais." },
  { num: '02', title: 'Étude & Planification', desc: "Études techniques détaillées, plans d'exécution, planning Gantt, commandes fournisseurs et mobilisation des équipes." },
  { num: '03', title: 'Exécution Terrain', desc: "Déploiement des équipes, travaux de génie civil et pose, tests et mesures, rapports d'avancement hebdomadaires." },
  { num: '04', title: 'Réception & Clôture', desc: "Essais de mise en service, levée de réserves, réception provisoire ONEE/maître d'ouvrage, remise du DOE." },
];

const references = [
  { name: 'ONEE', detail: "Office National de l'Électricité — Marchés HTA/BT nationaux", projects: '+320 marchés' },
  { name: 'MASEN', detail: 'Moroccan Agency for Sustainable Energy — Projets PV', projects: '18 projets PV' },
  { name: 'Min. Équipement', detail: "Ministère de l'Équipement et de l'Eau — VRD & génie civil", projects: '45 marchés' },
  { name: 'Collectivités', detail: 'Communes urbaines et rurales — Éclairage public et BT', projects: '+120 communes' },
];

const ActivityIcon = ({ id }) => {
  const p = { viewBox: '0 0 24 24', fill: 'none', stroke: 'white', strokeWidth: '1.75', strokeLinecap: 'round', strokeLinejoin: 'round', width: 24, height: 24 };
  if (id === 'distribution') return <svg {...p}><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
  if (id === 'eclairage') return <svg {...p}><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>;
  if (id === 'solaire') return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
  if (id === 'postes') return <svg {...p}><rect x="3" y="11" width="18" height="10" rx="1" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><line x1="12" y1="15" x2="12" y2="17" strokeWidth="2" /></svg>;
  if (id === 'vrd') return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
  return <svg {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
};

export default async function ActivitesPage() {
  const activities = await getAllActivities();

  return (
    <>
      <style>{`
        /* ACTIVITY CARDS GRID */
        .act-full-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .act-full-card {
          background: #ffffff;
          border: 1px solid rgba(10,22,40,0.07);
          border-top: 3px solid #00a3ff;
          border-radius: 6px;
          padding: 2rem 1.75rem;
          transition: transform 0.22s, box-shadow 0.22s;
          scroll-margin-top: 90px;
        }
        .act-full-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 56px rgba(10,22,40,0.1);
        }
        .act-full-icon {
          width: 46px;
          height: 46px;
          background: linear-gradient(135deg, #00a3ff, #0066cc);
          clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .act-full-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #0a1628;
          line-height: 1.2;
          margin-bottom: 0.7rem;
        }
        .act-full-desc {
          font-size: 0.88rem;
          color: rgba(10,22,40,0.55);
          line-height: 1.65;
          margin-bottom: 1.25rem;
        }
        .act-details {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(10,22,40,0.07);
        }
        .act-detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: rgba(10,22,40,0.55);
        }
        .act-detail-item::before {
          content: '';
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #00a3ff;
          flex-shrink: 0;
        }

        /* METHODOLOGY */
        .method-flow {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          position: relative;
        }
        .method-flow::before {
          content: '';
          position: absolute;
          top: 36px;
          left: calc(12.5% + 16px);
          right: calc(12.5% + 16px);
          height: 2px;
          background: linear-gradient(90deg, #00a3ff, #0066cc);
        }
        .method-step {
          padding: 0 1.5rem;
          text-align: center;
          position: relative;
        }
        .method-num-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 1.25rem;
          position: relative;
          z-index: 1;
        }
        .method-num {
          width: 72px;
          height: 72px;
          background: #0a1628;
          clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #00a3ff;
          letter-spacing: 0.05em;
        }
        .method-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #0a1628;
          margin-bottom: 0.65rem;
        }
        .method-desc {
          font-size: 0.87rem;
          color: rgba(10,22,40,0.55);
          line-height: 1.65;
        }

        /* REFERENCES */
        .refs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .ref-card {
          background: #f0f5ff;
          border: 1px solid rgba(0,163,255,0.12);
          border-radius: 6px;
          padding: 1.75rem 1.5rem;
          transition: transform 0.22s, box-shadow 0.22s;
        }
        .ref-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(10,22,40,0.08);
        }
        .ref-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #0a1628;
          letter-spacing: 0.04em;
          margin-bottom: 0.35rem;
        }
        .ref-detail {
          font-size: 0.82rem;
          color: rgba(10,22,40,0.55);
          line-height: 1.55;
          margin-bottom: 0.75rem;
        }
        .ref-projects {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #00a3ff;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .act-full-grid { grid-template-columns: repeat(2, 1fr); }
          .refs-grid { grid-template-columns: repeat(2, 1fr); }
          .method-flow { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
          .method-flow::before { display: none; }
        }
        @media (max-width: 640px) {
          .act-full-grid, .refs-grid, .method-flow { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── PAGE HERO ── */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="page-hero-label">Expertises</div>
          <h1>Nos Domaines<br />d'Expertise</h1>
          <p>Six domaines d'activité complémentaires couvrant l'ensemble des besoins en infrastructures électriques et énergétiques au Maroc.</p>
        </div>
      </section>

      {/* ── ACTIVITÉS GRID ── */}
      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="overline">Ce que nous faisons</span>
              <h2>Nos Activités</h2>
              <p>De la distribution haute tension au solaire photovoltaïque, nos équipes maîtrisent l'intégralité des métiers de l'énergie.</p>
            </div>
          </ScrollReveal>
          <div className="act-full-grid">
            {activities.map((a, i) => (
              <ScrollReveal key={a.slug} delay={i * 0.1}>
              <ActivityCard
                activity={a}
                id={a.slug}
                icon={<ActivityIcon id={a.icon} />}
                classPrefix="act-full"
                showArrow={false}
              />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODOLOGIE ── */}
      <section className="section-surface">
        <div className="container">
          <div className="section-header">
            <span className="overline">Notre Process</span>
            <h2>Notre Méthodologie</h2>
            <p>Un processus éprouvé en 4 étapes qui garantit la qualité, les délais et la conformité de chaque projet livré.</p>
          </div>
          <div className="method-flow">
            {steps.map((s) => (
              <div className="method-step" key={s.num}>
                <div className="method-num-wrap">
                  <div className="method-num">{s.num}</div>
                </div>
                <div className="method-title">{s.title}</div>
                <p className="method-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RÉFÉRENCES ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Marchés Publics</span>
            <h2>Références Clients</h2>
            <p>ATNER intervient exclusivement sur les marchés publics au service des grands opérateurs nationaux et des collectivités.</p>
          </div>
          <div className="refs-grid">
            {references.map((r) => (
              <div className="ref-card" key={r.name}>
                <div className="ref-name">{r.name}</div>
                <p className="ref-detail">{r.detail}</p>
                <div className="ref-projects">{r.projects}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-dark" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#00a3ff,#0066cc)' }} />
        <div className="container">
          <span className="overline">Projets Livrés</span>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Découvrez nos Réalisations</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: '1.75' }}>
            Plus de 500 projets livrés à travers les 12 régions du Maroc. Consultez notre portfolio complet.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/realisations" className="btn btn-primary">Voir nos Réalisations</Link>
            <Link href="/contact" className="btn btn-outline-white">Demander un Devis</Link>
          </div>
        </div>
      </section>
    </>
  );
}
