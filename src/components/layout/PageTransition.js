'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';

// Shared ref so the intercept handler can trigger the wipe
let triggerWipe = null;

export function usePageTransitionLink() {
  const router = useRouter();

  return function navigate(href) {
    if (triggerWipe) {
      triggerWipe(href);
    } else {
      router.push(href);
    }
  };
}

export default function PageTransition({ children }) {
  const wipeRef = useRef(null);
  const contentRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const isFirstRender = useRef(true);

  // Reveal content on route arrival
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // On first load just make sure content is visible
      gsap.set(contentRef.current, { opacity: 1 });
      return;
    }

    const wipe = wipeRef.current;
    const content = contentRef.current;

    // Wipe exits (diagonal sweeps off to top-right)
    gsap.to(wipe, {
      clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
      duration: 0.6,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(wipe, {
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        });
      },
    });

    // Content fades in
    gsap.fromTo(
      content,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.25, ease: 'power2.out', clearProps: 'all' }
    );
  }, [pathname]);

  // Register the global wipe trigger
  useEffect(() => {
    triggerWipe = (href) => {
      const wipe = wipeRef.current;
      const content = contentRef.current;

      // Content fades out
      gsap.to(content, { opacity: 0, y: -16, duration: 0.25, ease: 'power2.in' });

      // Wipe enters (diagonal sweeps in from left)
      gsap.fromTo(
        wipe,
        { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 0.55,
          ease: 'power3.inOut',
          onComplete: () => {
            router.push(href);
          },
        }
      );
    };

    return () => { triggerWipe = null; };
  }, [router]);

  // Intercept all <a> clicks on internal links
  useEffect(() => {
    function handleClick(e) {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Only intercept internal links
      if (href.startsWith('/') && !href.startsWith('//') && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        // Don't intercept if we're already on this route
        if (href === pathname) return;

        e.preventDefault();
        triggerWipe?.(href);
      }
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  return (
    <>
      {/* Diagonal wipe overlay */}
      <div
        ref={wipeRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'linear-gradient(135deg, #0a1628 60%, #00a3ff 100%)',
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Page content */}
      <div ref={contentRef} style={{ opacity: 1 }}>
        {children}
      </div>
    </>
  );
}
