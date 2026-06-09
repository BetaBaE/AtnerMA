import Link from 'next/link';
import { getAllTeamMembers } from '@/lib/api';
import HistoryTimeline from '@/components/qui-sommes-nous/HistoryTimeline';
import ScrollReveal from '@/components/layout/ScrollReveal';
const values = [
  {
    id: 'qualite',
    title: 'Qualité',
    desc: "Chaque ouvrage est réalisé selon les normes ONEE et les standards internationaux. Zéro compromis sur la conformité.",
  },
  {
    id: 'securite',
    title: 'Sécurité',
    desc: "La sécurité des équipes et des riverains est intégrée à chaque phase du projet, de l'étude à la réception.",
  },
  {
    id: 'delais',
    title: 'Respect des Délais',
    desc: 'Planification rigoureuse et suivi hebdomadaire garantissent la livraison dans les délais contractuels.',
  },
  {
    id: 'innovation',
    title: 'Innovation',
    desc: 'Intégration des technologies de pointe : smart metering, SCADA, supervision à distance et systèmes PV hybrides.',
  },
];

const certifications = [
  {
    id: 'onee',
    label: 'ONEE Agréé',
    category: 'Catégorie A',
    desc: 'Habilitation ONEE pour travaux HTA/HTB/BT sur le réseau national. Renouvellement annuel.',
    color: '#00a3ff',
  },
  {
    id: 'iso',
    label: 'ISO 9001:2015',
    category: 'Management Qualité',
    desc: 'Certification du système de management de la qualité. Audit externe annuel par organisme accrédité.',
    color: '#0066cc',
  },
  {
    id: 'qualibat',
    label: 'Qualibat Maroc',
    category: 'Génie Civil & BTP',
    desc: 'Qualification Qualibat pour travaux de génie civil, VRD et construction de postes électriques.',
    color: '#0a1628',
  },
];

export default async function QuiSommesNousPage() {
  const team = await getAllTeamMembers();
  const departments = [...new Set(team.map((m) => m.department).filter(Boolean))];
  return (
    <>
      <style>{`
        /* VALUES */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .value-card {
          background: #ffffff;
          border: 1px solid rgba(10,22,40,0.07);
          border-radius: 6px;
          padding: 2rem 1.75rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.22s, box-shadow 0.22s;
        }
        .value-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(10,22,40,0.09);
        }
        .value-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #00a3ff, #0066cc);
        }
        .value-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 3.5rem;
          font-weight: 800;
          color: rgba(0,163,255,0.1);
          line-height: 1;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }
        .value-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #0a1628;
          margin-bottom: 0.75rem;
        }
        .value-desc {
          font-size: 0.88rem;
          color: rgba(10,22,40,0.55);
          line-height: 1.65;
        }

        /* CERTS */
        .certs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .cert-card {
          border: 1px solid rgba(10,22,40,0.08);
          border-radius: 6px;
          padding: 2.25rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: transform 0.22s, box-shadow 0.22s;
        }
        .cert-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(10,22,40,0.09);
        }
        .cert-badge-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .cert-hex {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
          flex-shrink: 0;
        }
        .cert-hex svg {
          width: 22px;
          height: 22px;
          stroke: white;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .cert-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #0a1628;
          line-height: 1.1;
        }
        .cert-category {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(10,22,40,0.38);
        }
        .cert-desc {
          font-size: 0.88rem;
          color: rgba(10,22,40,0.58);
          line-height: 1.65;
        }

        /* TEAM */
        .dept-section {
          margin-bottom: 2rem;
        }
        .dept-section + .dept-section {
          padding-top: 2rem;
          border-top: 1px solid rgba(10,22,40,0.07);
        }
        .team-dept-label {
          text-align: center;
          margin-bottom: 1.25rem;
        }
        .team-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .team-card {
          width: 280px;
          flex-shrink: 0;
          align-items : center ;
          justify-content : center ;
          background: #ffffff;
          border: 1px solid rgba(10,22,40,0.07);
          border-left: 3px solid #00a3ff;
          border-radius: 8px;
          padding: 1.5rem;
          transition: transform 0.22s, box-shadow 0.22s;
        }
        .team-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(10,22,40,0.09);
        }
        .team-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: column;
          margin-bottom: 0.85rem;
          gap: 0.5rem;
        }
        .team-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #0a1628;
          line-height: 1.2;
        }
        .team-size {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #00a3ff;
          white-space: nowrap;
          padding: 0.2rem 0.5rem;
          border: 1px solid rgba(0,163,255,0.25);
          border-radius: 3px;
          flex-shrink: 0;
        }
        .team-desc {
          font-size: 0.88rem;
          color: rgba(10,22,40,0.55);
          line-height: 1.65;
        }
        .team-dept-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #00a3ff;
          text-align: center;
          margin-bottom: 1.25rem;
        }
        .team-photo {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          margin: 0 auto 1rem;
        }
        .team-desc {
          font-size: 0.88rem;
          color: rgba(10,22,40,0.55);
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .values-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 860px) {
          .certs-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 580px) {
          .values-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── PAGE HERO ── */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="page-hero-label">Entreprise</div>
          <h1>ATNER —<br />Atlas Énergie</h1>
          <p>Fondée à Rabat, engagée dans l'excellence des infrastructures énergétiques marocaines depuis plus de deux décennies.</p>
        </div>
      </section>

      <HistoryTimeline />

      {/* ── NOS VALEURS ── */}
      <section className="section-surface">
        <div className="container">
          <div className="section-header">
            <span className="overline">Ce qui nous guide</span>
            <h2>Nos Valeurs</h2>
            <p>Quatre principes fondateurs qui orientent chacune de nos décisions techniques et relationnelles.</p>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <ScrollReveal key={v.id} delay={i * 0.1}>
                <div className="value-card">
                  <div className="value-num">0{i + 1}</div>
                  <div className="value-title">{v.title}</div>
                  <div className="value-desc">{v.desc}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HABILITATIONS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Accréditations</span>
            <h2>Habilitations &amp; Certifications</h2>
            <p>Des qualifications officielles qui attestent de notre niveau d'exigence et de notre conformité aux standards du secteur.</p>
          </div>
          <div className="certs-grid">
            {certifications.map((c, i) => (
              <ScrollReveal key={c.id} delay={i * 0.1}>
                <div className="cert-card">
                  <div className="cert-badge-row">
                    <div className="cert-hex" style={{ background: c.color }}>
                      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <div>
                      <div className="cert-label">{c.label}</div> 
                      <div className="cert-category">{c.category}</div>
                    </div>
                  </div>
                  <p className="cert-desc">{c.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTRE ÉQUIPE ── */}
      <section className="section-surface">
        <div className="container">
          <div className="section-header">
            <span className="overline">Notre Équipe</span>
            <h2>L'Organisation ATNER</h2>
            <p>Des équipes structurées par métier pour garantir réactivité, expertise et qualité d'exécution sur chaque projet.</p>
          </div>
          {departments.map((dept) => (
            <div key={dept} className="dept-section">
              <div className="team-dept-label">{dept}</div>
              <div className="team-grid">
                {team.filter((m) => m.department === dept).map((m) => (
                  <div className="team-card" key={m.sys.id}>
                    {m.photo?.url && (
                      <img className="team-photo" src={m.photo.url} alt={m.photo.title ?? m.name} width={72} height={72} />
                    )}
                    <div className="team-card-header">
                      <div className="team-title">{m.name}</div> 
                      <div><span className="team-size">{m.role}</span></div>
                    </div>
                    <p className="team-desc">{m.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/contact" className="btn btn-primary">Nous Rejoindre</Link>
          </div>
        </div>
      </section>
    </>
  );
}
