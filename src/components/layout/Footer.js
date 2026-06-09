import Link from 'next/link';

const footerLinks = [
  {
    heading: 'Navigation',
    links: [
      { label: 'Accueil', href: '/' },
      { label: 'Qui Sommes-Nous', href: '/qui-sommes-nous' },
      { label: 'Nos Activités', href: '/activites' },
      { label: 'Nos Réalisations', href: '/realisations' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Activités',
    links: [
      { label: 'Distribution HTA/HTB/BT', href: '/activites#distribution' },
      { label: 'Éclairage Public', href: '/activites#eclairage' },
      { label: 'Solaire Photovoltaïque', href: '/activites#solaire' },
      { label: 'Postes de Transformation', href: '/activites#postes' },
      { label: 'VRD & Génie Civil', href: '/activites#genie-civil' },
    ],
  },
];

const contacts = [
  {
    label: 'Siège Social',
    lines: ['24, Route du Sud, Midelt'],
  },
  {
    label: 'Succursale',
    lines: ['Hay Ryad, Rabat'],
  },
  {
    label: 'Téléphone',
    lines: ['05 35 58 06 42 / 05 37 56 35 93'],
  },
  {
    label: 'Email',
    lines: ['contact@atner.co.ma'],
  },
];

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');

        .footer {
          background: #0a1628;
          border-top: 3px solid #00a3ff;
          padding: 4rem 2.5rem 0;
          font-family: 'Barlow', sans-serif;
          color: rgba(255,255,255,0.55);
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1.2fr;
          gap: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          margin-bottom: 0.25rem;
        }
        .footer-logo-mark {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #00a3ff, #0066cc);
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          flex-shrink: 0;
        }
        .footer-logo-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 1.3rem;
          letter-spacing: 0.08em;
          color: #fff;
          text-transform: uppercase;
        }
        .footer-logo-text span { color: #00a3ff; }
        .footer-tagline {
          font-size: 0.82rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.45);
          max-width: 260px;
        }
        .footer-certifs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.25rem;
        }
        .certif-badge {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #00a3ff;
          border: 1px solid rgba(0,163,255,0.3);
          padding: 0.2rem 0.55rem;
          border-radius: 2px;
        }
        .footer-col h4 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #00a3ff;
          margin: 0 0 1rem 0;
        }
        .footer-col ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-col ul a {
          font-size: 0.83rem;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .footer-col ul a::before {
          content: '';
          display: block;
          width: 4px;
          height: 4px;
          background: rgba(0,163,255,0.4);
          border-radius: 50%;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .footer-col ul a:hover {
          color: rgba(255,255,255,0.85);
        }
        .footer-col ul a:hover::before {
          background: #00a3ff;
        }
        .contact-item {
          margin-bottom: 0.85rem;
        }
        .contact-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 0.2rem;
        }
        .contact-value {
          font-size: 0.83rem;
          color: rgba(255,255,255,0.65);
        }
        .footer-divider {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 0;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .footer-copy {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.04em;
        }
        .footer-copy span {
          color: rgba(0,163,255,0.5);
        }
        .footer-rc {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.04em;
        }

        @media (max-width: 900px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 520px) {
          .footer { padding: 3rem 1.25rem 0; }
          .footer-top {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            {/* Brand column */}
            <div className="footer-brand">
              <Link href="/" className="footer-logo">
                <div className="footer-logo-mark" />
                <span className="footer-logo-text">AT<span>NER</span></span>
              </Link>
              <p className="footer-tagline">
                Leader national dans les services de l`électricité, de l`énergie
                et des travaux publics au Maroc depuis plus de 20 ans.
              </p>
              <div className="footer-certifs">
                <span className="certif-badge">ONEE Agréé</span>
                <span className="certif-badge">ISO Certifié</span>
                <span className="certif-badge">Qualibat</span>
              </div>
            </div>

            {/* Nav columns */}
            {footerLinks.map((col) => (
              <div className="footer-col" key={col.heading}>
                <h4>{col.heading}</h4>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact column */}
            <div className="footer-col">
              <h4>Contact</h4>
              {contacts.map((c) => (
                <div className="contact-item" key={c.label}>
                  <div className="contact-label">{c.label}</div>
                  {c.lines.map((line) => (
                    <div className="contact-value" key={line}>{line}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-divider">
            <p className="footer-copy">
              © {new Date().getFullYear()} <span>ATNER</span> — Atlas Énergie. Tous droits réservés.
            </p>
            <p className="footer-rc">
              RC · ICE · IF · Patente — Rabat, Maroc
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
