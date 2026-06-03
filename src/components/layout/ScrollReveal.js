'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FROM_VARS = {
  up:    { y: 40, opacity: 0 },
  left:  { x: -40, opacity: 0 },
  right: { x: 40, opacity: 0 },
  scale: { scale: 0.92, opacity: 0 },
};

export default function ScrollReveal({ children, className, delay = 0, direction = 'up' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.from(el, {
      ...FROM_VARS[direction],
      duration: 0.8,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
