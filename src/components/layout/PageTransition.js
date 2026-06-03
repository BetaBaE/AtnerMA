'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }) {
  const containerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' }
    );
  }, []);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' }
    );
  }, [pathname]);

  return (
    <div ref={containerRef} style={{ opacity: 1 }}>
      {children}
    </div>
  );
}
