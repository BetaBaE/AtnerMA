'use client';

import { useState } from 'react';
import Link from 'next/link';
import SectionScrollBar from '@/components/layout/SectionScrollBar';

const contactInfo = [
  {
    id: 'siege',
    label: 'Siège Social',
    lines: ['24, Route du Sud, Midelt'],
    icon: 'location',
  },
  {
    id: 'succursale',
    label: 'Succursale',
    lines: ['4, Immeuble Elyamama A, Avenue Ennakhil', 'Hay Ryad, Rabat'],
    icon: 'location',
  },
  {
    id: 'tel',
    label: 'Téléphone / Fax',
    lines: ['Tél : 05 35 58 06 42 / 05 37 56 35 93', 'Fax : 05 35 58 02 34'],
    icon: 'phone',
  },
  {
    id: 'email',
    label: 'Email',
    lines: ['contact@atner.co.ma'],
    icon: 'mail',
  },
];

const subjectOptions = [
  'Appel d\'offres / Marché public',
  'Demande de devis',
  'Partenariat / Sous-traitance',
  'Recrutement',
  'Information générale',
  'Autre',
];

const ContactIcon = ({ id }) => {
  const p = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.75', strokeLinecap: 'round', strokeLinejoin: 'round', width: 20, height: 20 };
  if (id === 'location') return <svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
  if (id === 'phone') return <svg {...p}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>;
  if (id === 'mail') return <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
  return <svg {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5" /></svg>;
};

const SECTIONS = [
  { id: 'contact-hero', label: 'Contact' },
  { id: 'contact-form', label: 'Formulaire' },
  { id: 'contact-map',  label: 'Localisation' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', societe: '', telephone: '', email: '', objet: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to backend / email service
    setSubmitted(true);
  };

  return (
    <>
      <SectionScrollBar sections={SECTIONS} />
      <style>{`
        /* CONTACT LAYOUT */
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 4rem;
          align-items: start;
        }

        /* INFO SIDE */
        .contact-info-stack {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .info-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: #f0f5ff;
          border: 1px solid rgba(0,163,255,0.1);
          border-radius: 6px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .info-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(10,22,40,0.08);
        }
        .info-icon {
          width: 40px;
          height: 40px;
          background: #0a1628;
          clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #00a3ff;
        }
        .info-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(10,22,40,0.38);
          margin-bottom: 0.4rem;
        }
        .info-line {
          font-size: 0.9rem;
          color: #0a1628;
          line-height: 1.55;
          font-weight: 500;
        }

        /* FORM */
        .contact-form {
          background: #ffffff;
          border: 1px solid rgba(10,22,40,0.08);
          border-radius: 8px;
          padding: 2.5rem;
        }
        .form-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #0a1628;
          margin-bottom: 0.5rem;
        }
        .form-sub {
          font-size: 0.88rem;
          color: rgba(10,22,40,0.5);
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }
        .form-row .form-group { margin-bottom: 0; }
        .form-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(10,22,40,0.55);
        }
        .form-label span {
          color: #00a3ff;
          margin-left: 2px;
        }
        .form-input, .form-select, .form-textarea {
          font-family: 'Barlow', sans-serif;
          font-size: 0.92rem;
          color: #0a1628;
          background: #f8faff;
          border: 1.5px solid rgba(10,22,40,0.1);
          border-radius: 4px;
          padding: 0.7rem 0.9rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          width: 100%;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #00a3ff;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(0,163,255,0.1);
        }
        .form-input::placeholder, .form-textarea::placeholder {
          color: rgba(10,22,40,0.3);
        }
        .form-select {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230a1628' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.9rem center;
          padding-right: 2.25rem;
        }
        .form-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.65;
        }
        .form-submit {
          width: 100%;
          justify-content: center;
          margin-top: 0.5rem;
          font-size: 0.88rem;
        }

        /* SUCCESS */
        .form-success {
          text-align: center;
          padding: 3rem 2rem;
        }
        .success-hex {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #00a3ff, #0066cc);
          clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .success-hex svg {
          width: 28px;
          height: 28px;
          stroke: white;
          fill: none;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .success-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #0a1628;
          margin-bottom: 0.75rem;
        }
        .success-sub {
          font-size: 0.95rem;
          color: rgba(10,22,40,0.55);
          line-height: 1.7;
          max-width: 380px;
          margin: 0 auto;
        }

        /* MAP PLACEHOLDER */
        .map-placeholder {
          height: 320px;
          background:
            repeating-linear-gradient(0deg, rgba(0,163,255,0.03) 0px, rgba(0,163,255,0.03) 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(90deg, rgba(0,163,255,0.03) 0px, rgba(0,163,255,0.03) 1px, transparent 1px, transparent 40px),
            #f0f5ff;
          border-radius: 8px;
          border: 1px solid rgba(0,163,255,0.12);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: rgba(10,22,40,0.35);
        }
        .map-placeholder svg {
          width: 40px;
          height: 40px;
          stroke: rgba(0,163,255,0.4);
          fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .map-placeholder p {
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(10,22,40,0.3);
        }

        /* RESPONSIVE */
        @media (max-width: 860px) {
          .contact-layout { grid-template-columns: 1fr; gap: 2.5rem; }
          .contact-form { padding: 2rem 1.5rem; }
        }
        @media (max-width: 520px) {
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── PAGE HERO ── */}
      <section className="page-hero" data-section="contact-hero">
        <div className="page-hero-inner">
          <div className="page-hero-label">Contact</div>
          <h1>Contactez<br />ATNER</h1>
          <p>Notre bureau d&apos;études est à votre disposition pour analyser vos projets et répondre à vos appels d&apos;offres.</p>
        </div>
      </section>

      {/* ── CONTACT LAYOUT ── */}
      <section className="section" data-section="contact-form">
        <div className="container">
          <div className="contact-layout">
            {/* Info column */}
            <div>
              <span className="overline" style={{ marginBottom: '1.5rem', display: 'block' }}>Coordonnées</span>
              <div className="contact-info-stack">
                {contactInfo.map((c) => (
                  <div className="info-card" key={c.id}>
                    <div className="info-icon">
                      <ContactIcon id={c.icon} />
                    </div>
                    <div>
                      <div className="info-label">{c.label}</div>
                      {c.lines.map((l) => (
                        <div className="info-line" key={l}>{l}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form column */}
            <div className="contact-form">
              {submitted ? (
                <div className="form-success">
                  <div className="success-hex">
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="success-title">Message Envoyé</div>
                  <p className="success-sub">
                    Merci pour votre message. Notre équipe vous répondra dans les 48 heures ouvrables.
                  </p>
                </div>
              ) : (
                <>
                  <div className="form-title">Formulaire de Contact</div>
                  <p className="form-sub">Tous les champs marqués d&apos;un astérisque sont obligatoires.</p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="nom">Nom &amp; Prénom <span>*</span></label>
                        <input
                          id="nom"
                          name="nom"
                          type="text"
                          className="form-input"
                          placeholder="Votre nom complet"
                          value={form.nom}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="societe">Société / Organisation</label>
                        <input
                          id="societe"
                          name="societe"
                          type="text"
                          className="form-input"
                          placeholder="Nom de votre organisation"
                          value={form.societe}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="telephone">Téléphone <span>*</span></label>
                        <input
                          id="telephone"
                          name="telephone"
                          type="tel"
                          className="form-input"
                          placeholder="+212 6XX XXX XXX"
                          value={form.telephone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="email">Email <span>*</span></label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="form-input"
                          placeholder="votre@email.ma"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="objet">Objet <span>*</span></label>
                      <select
                        id="objet"
                        name="objet"
                        className="form-select"
                        value={form.objet}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Sélectionnez un objet…</option>
                        {subjectOptions.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="message">Message <span>*</span></label>
                      <textarea
                        id="message"
                        name="message"
                        className="form-textarea"
                        placeholder="Décrivez votre projet, vos besoins ou votre demande…"
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary form-submit">
                      Envoyer le Message →
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="section-surface" data-section="contact-map">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <span className="overline">Localisation</span>
            <h2>Notre Siège — Rabat</h2>
          </div>
          <iframe
            src="https://maps.google.com/maps?q=33.9716,-6.8498&output=embed"
              width="100%"
              height="320"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ATNER Hay Ryad Rabat Maroc"
            />
        </div>
      </section>
    </>
  );
}
