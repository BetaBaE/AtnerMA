'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function ActivityCard({ activity, href, id, icon, classPrefix = 'act', showArrow = true }) {
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const arrowRef = useRef(null);

  function handleEnter() {
    gsap.to(cardRef.current, { y: -8, duration: 0.3, ease: 'power2.out' });
    gsap.to(iconRef.current, { scale: 1.15, duration: 0.3, ease: 'power2.out' });
    if (arrowRef.current) gsap.to(arrowRef.current, { x: 6, duration: 0.3, ease: 'power2.out' });
  }

  function handleLeave() {
    gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: 'power2.out' });
    gsap.to(iconRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' });
    if (arrowRef.current) gsap.to(arrowRef.current, { x: 0, duration: 0.3, ease: 'power2.out' });
  }

  const inner = (
    <>
      <div ref={iconRef} className={`${classPrefix}-icon`}>
        {icon}
      </div>
      <div className={`${classPrefix}-title`}>{activity.title}</div>
      <div className={`${classPrefix}-desc`}>{activity.shortDescription}</div>
      {showArrow && (
        <span ref={arrowRef} className="act-more">En savoir plus →</span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        ref={cardRef}
        href={href}
        className={`${classPrefix}-card`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      ref={cardRef}
      id={id}
      className={`${classPrefix}-card`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {inner}
    </div>
  );
}
