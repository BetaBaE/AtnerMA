import Link from 'next/link';

// TODO: replace with Contentful data
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

const team = [
  {
    id: 'direction',
    title: 'Direction Générale',
    desc: "Pilotage stratégique, relations institutionnelles avec ONEE, MASEN et ministères. Décisions contractuelles et partenariats.",
    size: '2 cadres',
  },
  {
    id: 'bureau',
    title: "Bureau d'Études & Projets",
    desc: "Réponse aux AO, études techniques HTA/BT/PV, métrés, plans d'exécution, coordination PMO et suivi budgétaire.",
    size: '8 ingénieurs',
  },
  {
    id: 'terrain',
    title: 'Équipes Terrain',
    desc: 'Chefs de chantier, électriciens, câbleurs et conducteurs engins déployés sur sites à travers les 12 régions.',
    size: '+80 techniciens',
  },
  {
    id: 'admin',
    title: 'Administration & Finance',
    desc: 'Gestion des marchés publics, facturation ONEE/collectivités, ressources humaines et conformité réglementaire.',
    size: '5 collaborateurs',
  },
];

export default function QuiSommesNousPage() {
  return (
    <>
      <style>{`
        /* HISTOIRE */
        .histoire-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .histoire-text h2 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #0a1628;
          letter-spacing: 0.02em;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        .histoire-text p {
          font-size: 0.97rem;
          color: rgba(10,22,40,0.65);
          line-height: 1.8;
          margin-bottom: 1rem;
        }
        .histoire-text p:last-of-type { margin-bottom: 1.75rem; }
        .histoire-visual {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .mv-card {
          background: #f0f5ff;
          border-left: 3px solid #00a3ff;
          padding: 1.5rem 1.75rem;
          border-radius: 0 6px 6px 0;
        }
        .mv-card h4 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #00a3ff;
          margin-bottom: 0.5rem;
        }
        .mv-card p {
          font-size: 0.92rem;
          color: rgba(10,22,40,0.7);
          line-height: 1.6;
        }
        .histoire-year-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: #0a1628;
          color: #ffffff;
          padding: 0.6rem 1.25rem;
          border-radius: 4px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .histoire-year-badge span { color: #00a3ff; font-size: 1.4rem; }

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
        .team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .team-card {
          background: #ffffff;
          border: 1px solid rgba(10,22,40,0.07);
          border-radius: 6px;
          padding: 2rem 1.75rem;
          transition: transform 0.22s, box-shadow 0.22s;
        }
        .team-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(10,22,40,0.09);
        }
        .team-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
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

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .values-grid, .team-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 860px) {
          .histoire-grid { grid-template-columns: 1fr; gap: 3rem; }
          .certs-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 580px) {
          .values-grid, .team-grid { grid-template-columns: 1fr; }
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

      {/* ── NOTRE HISTOIRE ── */}
      <section className="section">
        <div className="container">
          <div className="histoire-grid">
            <div className="histoire-text">
              <span className="overline">Notre Histoire</span>
              <h2>Fondée à Rabat,<br />Présente Partout</h2>
              <p>
                ATNER — Atlas Énergie a été fondée au début des années 2000 à Rabat par des ingénieurs
                spécialisés en distribution électrique. Dès ses premières années, l'entreprise s'est
                positionnée sur les marchés ONEE, puis a progressivement élargi son portefeuille aux
                collectivités territoriales et aux projets d'énergie renouvelable.
              </p>
              <p>
                Aujourd'hui, ATNER est active dans les 12 régions du Royaume, avec plus de 500 projets
                livrés, allant de la pose de lignes HTA rurales à la réalisation de centrales photovoltaïques
                raccordées au réseau national.
              </p>
              <Link href="/realisations" className="btn btn-primary">Voir nos Réalisations</Link>
            </div>
            <div className="histoire-visual">
              <div className="histoire-year-badge">
                Fondée en <span>2002</span> · Rabat, Maroc
              </div>
              <div className="mv-card">
                <h4>Notre Mission</h4>
                <p>
                  Concevoir, réaliser et maintenir les infrastructures énergétiques du Maroc avec
                  excellence, en partenariat avec les acteurs publics nationaux et régionaux.
                </p>
              </div>
              <div className="mv-card">
                <h4>Notre Vision</h4>
                <p>
                  Être le partenaire de référence des donneurs d'ordres publics marocains pour les
                  projets électriques, solaires et d'éclairage à horizon 2030.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <div className="value-card" key={v.id}>
                <div className="value-num">0{i + 1}</div>
                <div className="value-title">{v.title}</div>
                <div className="value-desc">{v.desc}</div>
              </div>
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
            {certifications.map((c) => (
              <div className="cert-card" key={c.id}>
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
          <div className="team-grid">
            {team.map((t) => (
              <div className="team-card" key={t.id}>
                <div className="team-card-header">
                  <div className="team-title">{t.title}</div>
                  <span className="team-size">{t.size}</span>
                </div>
                <p className="team-desc">{t.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/contact" className="btn btn-primary">Nous Rejoindre</Link>
          </div>
        </div>
      </section>
    </>
  );
}
