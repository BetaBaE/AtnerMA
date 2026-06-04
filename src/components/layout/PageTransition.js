'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }) {
  const curtainRef = useRef(null);
  const contentRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(curtainRef.current, { yPercent: 0 });
      gsap.to(curtainRef.current, {
        yPercent: -105,
        duration: 0.75,
        delay: 0.05,
        ease: 'power3.inOut',
        
      });
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.15,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );
    });

    return () => ctx.revert();
  }, [pathname]);

  return (
    <>
      <div
        ref={curtainRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: '#0a1628',
          pointerEvents: 'none',
          transform: 'translateY(-105%)',
        }}
      />
      <div ref={contentRef} style={{ opacity: 1 }}>
        {children}
      </div>
    </>
  );
}
