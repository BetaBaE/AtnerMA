'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  '/sphere/load_1.webp',
  '/sphere/load_2.webp',
  '/sphere/load_3.webp',
  '/sphere/load_4.webp',
  '/sphere/load_LAST.webp',
  '/sphere/activity.webp',
  '/sphere/contact.webp',
  '/sphere/projects_img.webp',
  '/sphere/1-8.jpg',
  '/sphere/FES-MEKNES-2.jpg',
  '/sphere/4-5.jpg',
  '/sphere/AIN-AOUDA-2.jpg',
  '/sphere/AIN-AOUDA-5.jpg',
  '/sphere/Ain-Aouda-7.jpg',
  '/sphere/CONAKRY-12.jpeg',
  '/sphere/DJI_0002-scaled.jpg',
  '/sphere/DJI_0012-scaled.jpg',
  '/sphere/DevDurable-scaled.jpg',
  '/sphere/Efficience-2-1.jpg',
];

const CHAPTERS = [
  { title: "Distribution d'Eau Potable", img: '/intro/load_1.webp', desc: "Conception et réalisation de réseaux d'adduction et de distribution d'eau potable, garantissant un approvisionnement fiable des populations et des collectivités à travers le Royaume." },
  { title: "Épuration des Eaux Usées", img: '/intro/load_2.webp', desc: "Construction de stations d'épuration à boues activées et séchage solaire, traitant les effluents urbains pour protéger les ressources hydriques et l'environnement." },
  { title: "Dessalement", img: '/intro/load_3.webp', desc: "Ingénierie et travaux de stations de dessalement de l'eau de mer, une réponse durable au stress hydrique des régions côtières marocaines." },
  { title: "Pompage et Réservoirs", img: '/intro/load_4.webp', desc: "Stations de pompage et ouvrages de stockage dimensionnés pour sécuriser le transfert et la disponibilité de l'eau sur l'ensemble du territoire." },
  { title: "Transfert d'Eau", img: '/intro/load_LAST.webp', desc: "Réalisation de canalisations et d'ouvrages de transfert de grande capacité, reliant les zones de production aux bassins de consommation." },
];

// 20 cards, one per image in public/sphere
const CARD_COUNT = 20;
const cards = Array.from({ length: CARD_COUNT }, (_, i) => IMAGES[i % IMAGES.length]);

export default function ProjectSphere() {
  const containerRef = useRef(null);
  const sphereRef = useRef(null);
  const [chapter, setChapter] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const sphere = sphereRef.current;
    const container = containerRef.current;
    if (!sphere || !container) return;

    const mq = window.matchMedia('(max-width: 767px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches || reduce.matches) return; // mobile / reduced-motion: no sphere animation

    const radius = 290;
    const cardEls = Array.from(sphere.children);

    // Fibonacci sphere placement
    cardEls.forEach((card, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / CARD_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      const rotY = Math.atan2(x, z) * (180 / Math.PI);
      const rotX = Math.asin(-y / radius) * (180 / Math.PI);
      card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    });

    let lastChapter = 0;
    const st = gsap.to(sphere, {
      rotateY: 720,
      rotateX: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: '.sphere-scene',
        pinType: 'transform',
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length));
          if (idx !== lastChapter) {
            lastChapter = idx;
            setFading(true);
            setTimeout(() => { setChapter(idx); setFading(false); }, 200);
          }
        },
      },
    });

    // Refresh so ScrollTrigger measures correctly after Lenis/layout settle
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 300);

    return () => {
      clearTimeout(t);
      st.scrollTrigger?.kill();
      st.kill();
    };
  }, []);

  return (
    <section className="sphere-section" data-section="domaines" ref={containerRef}>
      <style>{`
        .sphere-section {
          position: relative;
          height: 300vh;
          background: radial-gradient(ellipse 80% 60% at 60% 45%, #12294a 0%, #0a1628 55%, #060f1e 100%);
        }
        .sphere-scene::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 60%;
          width: 700px;
          height: 700px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(0,102,204,0.12) 0%, rgba(0,163,255,0.05) 40%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .sphere-scene {
          position: relative;
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
          overflow: hidden;
        }
        .sphere-heading {
          position: absolute;
          top: 3rem;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 5;
        }
        .sphere-overline {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #00a3ff;
        }
        .sphere-heading h2 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #ffffff;
          margin-top: 0.4rem;
        }
        .sphere {
          margin-top : 30px;
          position: relative;
          width: 0;
          height: 0;
          margin-top: 3rem;
          transform-style: preserve-3d;
        }
        .sphere-card {
          position: absolute;
          width: 130px;
          height: 175px;
          left: -65px;
          top: -87px;
          border-radius: 12px;
          overflow: hidden;
          background: #0e2340;
          border: 1px solid rgba(0,163,255,0.15);
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          transform-style: preserve-3d;
        }
        .sphere-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.85) brightness(0.8);
        }
        .sphere-text {
          position: absolute;
          left: 8%;
          top: 50%;
          transform: translateY(-50%);
          max-width: 360px;
          z-index: 6;
          transition: opacity 0.25s ease;
        }
        .sphere-text.fading { opacity: 0; }
        .sphere-text h3 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2.4rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 1.1rem;
          padding-top: 1rem;
          position: relative;
          text-shadow: 0 4px 24px rgba(0,0,0,0.7), 0 0 40px rgba(0,163,255,0.15);
        }
        .sphere-text h3::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 48px;
          height: 3px;
          background: linear-gradient(90deg, #00a3ff, #0066cc);
        }
        .sphere-text p {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          border-left: 2px solid rgba(0,163,255,0.25);
          padding-left: 1rem;
        }
        /* FALLBACK (mobile + reduced-motion): alternating image/text rows */
        .sphere-mobile-list { display: none; }
        .fallback-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: center;
          margin-bottom: 3rem;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }
        .fallback-row:nth-child(even) .fallback-img { order: 2; }
        .fallback-img {
          height: 260px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(0,163,255,0.15);
        }
        .fallback-img img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.9) brightness(0.85); }
        .fallback-text h3 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.9rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 1rem;
        }
        .fallback-text p { font-size: 0.95rem; color: rgba(255,255,255,0.7); line-height: 1.7; }
        @media (max-width: 767px) {
          .sphere-section { height: auto; }
          .sphere-scene { position: relative; height: auto; padding: 4rem 1.25rem; flex-direction: column; perspective: none; overflow: visible; }
          .sphere { display: none; }
          .sphere-heading { position: relative; top: 0; transform: none; margin-bottom: 2.5rem; }
          .sphere-text { display: none; }
          .sphere-mobile-list { display: block; }
          .fallback-row { grid-template-columns: 1fr; gap: 1.25rem; margin-bottom: 2.5rem; }
          .fallback-row:nth-child(even) .fallback-img { order: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sphere-section { height: auto; }
          .sphere-scene { position: relative; height: auto; padding: 4rem 1.5rem; flex-direction: column; perspective: none; overflow: visible; }
          .sphere { display: none; }
          .sphere-heading { position: relative; top: 0; transform: none; margin-bottom: 2.5rem; }
          .sphere-text { display: none; }
          .sphere-mobile-list { display: block; }
        }
      `}</style>

      <div className="sphere-scene">
        <div className="sphere-heading">
          <span className="sphere-overline">Nos Domaines</span>
          <h2>Expertise Hydraulique</h2>
        </div>

        <div className="sphere" ref={sphereRef}>
          {cards.map((src, i) => (
            <div className="sphere-card" key={i}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>

        {/* Desktop rotating text */}
        <div className={`sphere-text sphere-text-desktop ${fading ? 'fading' : ''}`}>
          <h3>{CHAPTERS[chapter].title}</h3>
          <p>{CHAPTERS[chapter].desc}</p>
        </div>

        {/* Fallback (mobile + reduced-motion): alternating image/text rows */}
        <div className="sphere-mobile-list">
          {CHAPTERS.map((c) => (
            <div className="fallback-row" key={c.title}>
              <div className="fallback-img"><img src={c.img} alt={c.title} loading="lazy" /></div>
              <div className="fallback-text">
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
