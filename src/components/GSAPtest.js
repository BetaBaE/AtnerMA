'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function GSAPtest() {
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.from(boxRef.current, {
      x: -200,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out',
    });
  }, []);

  return (
    <div ref={boxRef} style={{
      width: '100px',
      height: '100px',
      background: '#00a3ff',
      margin: '200px auto',
    }} />
  );
}