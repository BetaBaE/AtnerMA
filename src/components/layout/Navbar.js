'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Qui Sommes-Nous', href: '/qui-sommes-nous' },
  { label: 'Nos Activités', href: '/activites' },
  { label: 'Nos Réalisations', href: '/realisations' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Show navbar only after user scrolls past 80% of viewport height
      setVisible(y > window.innerHeight * 0.5);
      setScrolled(y > window.innerHeight * 0.5 + 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0 2.5rem;
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), background 0.35s ease, box-shadow 0.35s ease, opacity 0.45s ease;
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
        }
        .navbar.nav-visible {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }
        .navbar.transparent {
          background: rgba(255,255,255,0.92);
          border-bottom: 1px solid rgba(10,22,40,0.08);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .navbar.solid {
          background: #ffffff;
          border-bottom: 1px solid rgba(10,22,40,0.1);
          box-shadow: 0 2px 24px rgba(10,22,40,0.08);
        }
        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
        }
        .logo-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 1.4rem;
          letter-spacing: 0.08em;
          color: #0a1628;
          text-transform: uppercase;
        }
        .logo-text span {
          color: #00a3ff;
        }
        .logo-sub {
          font-family: 'Barlow', sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          color: rgba(10,22,40,0.4);
          text-transform: uppercase;
          display: block;
          margin-top: -4px;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-links a {
          font-family: 'Barlow', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(10,22,40,0.65);
          text-decoration: none;
          padding: 0.5rem 0.85rem;
          border-radius: 4px;
          transition: color 0.2s, background 0.2s;
          position: relative;
        }
        .nav-links a:hover {
          color: #0a1628;
          background: rgba(0, 163, 255, 0.08);
        }
        .nav-links a.active {
          color: #00a3ff;
        }
        .nav-cta {
          font-family: 'Barlow', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #ffffff !important;
          background: linear-gradient(135deg, #00a3ff, #0066cc) !important;
          padding: 0.5rem 1.2rem !important;
          border-radius: 4px !important;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.2s !important;
        }
        .nav-cta:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          background: linear-gradient(135deg, #00a3ff, #0066cc) !important;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 8px;
          background: none;
          border: none;
        }
        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #0a1628;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        .mobile-menu {
          display: none;
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          background: #ffffff;
          border-bottom: 1px solid rgba(10,22,40,0.1);
          box-shadow: 0 8px 24px rgba(10,22,40,0.08);
          padding: 1rem 2.5rem 1.5rem;
          z-index: 99;
          flex-direction: column;
          gap: 0.25rem;
        }
        .mobile-menu.open {
          display: flex;
        }
        .mobile-menu a {
          font-family: 'Barlow', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(10,22,40,0.7);
          text-decoration: none;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(10,22,40,0.06);
          transition: color 0.2s;
        }
        .mobile-menu a:hover { color: #00a3ff; }
        .mobile-menu a:last-child {
          border-bottom: none;
          color: #00a3ff;
          margin-top: 0.5rem;
        }

        @media (max-width: 860px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .navbar { padding: 0 1.25rem; }
        }
      `}</style>

      {/* Load fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap"
        rel="stylesheet"
      />

      <nav className={`navbar ${visible ? 'nav-visible' : ''} ${scrolled ? 'solid' : 'transparent'}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <Image
              src="/LOGO_Rev.png"
              alt="ATNER Logo"
              width={36}
              height={36}
              style={{ objectFit: 'contain' }}
            />
            <div>
              <span className="logo-text">AT<span>NER</span></span>
              <span className="logo-sub">Atlas Énergie · Maroc</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="nav-links">
            {navLinks.slice(0, -1).map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="nav-cta">
                Nous Contacter
              </Link>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
