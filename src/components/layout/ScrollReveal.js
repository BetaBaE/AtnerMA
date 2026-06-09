'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars = {
      up:    { y: 30 },
      left:  { x: -30 },
      right: { x: 30 },
      scale: { scale: 0.95 },
    }[direction] || { y: 30 };

    // Set initial state ONLY on the transform, never opacity
    // opacity is controlled purely by CSS class
    el.classList.add('reveal-hidden');

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { ...fromVars, opacity: 0 },
        {
          ...Object.fromEntries(Object.keys(fromVars).map(k => [k, 0])),
          opacity: 1,
          duration: 0.7,
          delay,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () => el.classList.remove('reveal-hidden'),
          },
        }
      );
    }, el);

    return () => {
      ctx.revert();
      el.classList.remove('reveal-hidden');
    };
  }, [direction, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
