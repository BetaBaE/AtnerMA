'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE = [
  {
    period: `${new Date().getFullYear()} — Aujourd'hui`,
    label: "Expansion nationale",
    desc: "ATNER s'impose comme leader national des services de l'eau et des travaux publics, avec plus de 500 projets livrés à travers les 12 régions du Royaume.",
    image: '/intro/load_LAST.jpg',
    year: "Aujourd'hui",
  },
  {
    period: '2015 — 2009',
    label: 'Diversification',
    desc: "Diversification des expertises et développement de nouvelles compétences techniques. Présence renforcée sur les marchés publics nationaux et régionaux.",
    image: '/intro/load_4.jpg',
    year: '2015',
  },
  {
    period: '2009 — 2004',
    label: 'Croissance',
    desc: "Croissance soutenue et consolidation du positionnement sur les marchés publics. Développement des équipes terrain et du bureau d'études.",
    image: '/intro/load_3.jpg',
    year: '2009',
  },
  {
    period: '2004 — 1996',
    label: 'Premiers grands marchés',
    desc: "Premiers grands marchés publics nationaux. ATNER s'établit comme référence dans les infrastructures hydrauliques et le génie civil.",
    image: '/intro/load_2.jpg',
    year: '2004',
  },
  {
    period: '1988 — Fondation',
    label: 'Création',
    desc: "Fondée en 1988 à Rabat, ATNER démarre dans la réalisation d'ouvrages hydrauliques, la construction de réservoirs de stockage et le génie civil des stations de pompage.",
    image: '/intro/load_1.jpg',
    year: '1988',
  },
];

export default function HistoryTimeline() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      if (!trackRef.current || !sectionRef.current) return;

      // Store the container animation in a variable
      const containerAnim = gsap.to(trackRef.current, {
        x: () => {
          if (!trackRef.current) return 0;
          return -(trackRef.current.offsetWidth - window.innerWidth);
        },
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => {
            if (!trackRef.current) return '+=0';
            return `+=${trackRef.current.offsetWidth - window.innerWidth}`;
          },
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = (self.progress * 100) + '%';
            }
            const slideIndex = Math.round(self.progress * (TIMELINE.length - 1));
            if (counterRef.current) {
              counterRef.current.innerText = (slideIndex + 1) + ' / ' + TIMELINE.length;
            }
          },
        },
      });

      // Animate each slide's text and image using the stored tween directly
      const slides = sectionRef.current.querySelectorAll('.timeline-slide');
      slides.forEach((slide) => {
        const textEl = slide.querySelector('.timeline-text');
        const imgEl = slide.querySelector('.timeline-img');

        if (textEl) {
          gsap.fromTo(textEl,
            { opacity: 0, x: 40 },
            {
              opacity: 1, x: 0, duration: 0.6,
              scrollTrigger: {
                trigger: slide,
                containerAnimation: containerAnim,
                start: 'left 70%',
                once: true,
              },
            }
          );
        }

        if (imgEl) {
          gsap.fromTo(imgEl,
            { opacity: 0, scale: 1.05 },
            {
              opacity: 1, scale: 1, duration: 0.8,
              scrollTrigger: {
                trigger: slide,
                containerAnimation: containerAnim,
                start: 'left 80%',
                once: true,
              },
            }
          );
        }
      });

      // Infinite oscillation on scroll hint
      const hint = sectionRef.current.querySelector('.timeline-scroll-hint');
      if (hint) {
        gsap.to(hint, {
          x: 8,
          duration: 0.8,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .timeline-track {
            display: block !important;
            width: 100% !important;
            height: auto !important;
          }
          .timeline-slide {
            width: 100% !important;
            height: auto !important;
            flex-direction: column !important;
            padding-bottom: 3rem !important;
          }
          .timeline-img {
            width: calc(100% - 3rem) !important;
            height: 50vw !important;
            margin-left: 1.5rem !important;
            margin-top: 2rem !important;
          }
          .timeline-text {
            width: 100% !important;
            padding: 2rem 1.5rem !important;
          }
          .timeline-scroll-hint {
            display: none !important;
          }
        }
      `}</style>

      <div ref={sectionRef} style={{ position: 'relative', width: '100%' }}>
        {/* Progress bar */}
        <div
          ref={progressRef}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            height: '3px',
            width: '0%',
            background: 'linear-gradient(90deg, #00a3ff, #0066cc)',
            zIndex: 10,
          }}
        />

        {/* Slide counter */}
        <div
          ref={counterRef}
          style={{
            position: 'fixed',
            top: '50%',
            right: '2rem',
            transform: 'translateY(-50%)',
            zIndex: 10,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          1 / {TIMELINE.length}
        </div>

        {/* Scrolling track */}
        <div
          ref={trackRef}
          className="timeline-track"
          style={{
            display: 'flex',
            width: `${TIMELINE.length * 100}vw`,
            height: '100vh',
          }}
        >
          {TIMELINE.map((item, i) => (
            <div
              key={item.year}
              className="timeline-slide"
              style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: '#0a1628',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left column: image */}
              <div
                className="timeline-img"
                style={{
                  width: '45%',
                  height: '72vh',
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  marginLeft: '4vw',
                }}
              >
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  quality={100}
                  style={{ objectFit: 'contain' }}
                  sizes="45vw"
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '40%',
                  background: 'linear-gradient(to top, rgba(10,22,40,0.7), transparent)',
                  borderRadius: '0 0 8px 8px',
                  pointerEvents: 'none',
                }} />
              </div>

              {/* Right column: text */}
              <div
                className="timeline-text"
                style={{
                  width: '55%',
                  padding: '0 6vw',
                  position: 'relative',
                }}
              >
                {/* Ghost year behind text */}
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(5rem, 10vw, 8rem)',
                  color: 'rgba(255,255,255,0.08)',
                  position: 'absolute',
                  top: '50%',
                  left: '5vw',
                  transform: 'translateY(-50%)',
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}>
                  {item.year}
                </div>

                {/* Blue accent line */}
                <div style={{
                  width: '3px',
                  height: '40px',
                  background: '#00a3ff',
                  marginBottom: '1.5rem',
                }} />

                {/* Period label */}
                <div style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#00a3ff',
                  marginBottom: '1rem',
                }}>
                  {item.period}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                  lineHeight: 1.1,
                }}>
                  {item.label}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.8,
                  maxWidth: '480px',
                }}>
                  {item.desc}
                </p>
              </div>

              {/* Scroll hint — first slide only */}
              {i === 0 && (
                <div
                  className="timeline-scroll-hint"
                  style={{
                    position: 'absolute',
                    bottom: '2rem',
                    right: '3rem',
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}
                >
                  scroll →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
