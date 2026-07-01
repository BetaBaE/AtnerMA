'use client';

import { useState } from 'react';
import Link from 'next/link';

function Arrow({ project, side }) {
  const [hovered, setHovered] = useState(false);
  const isLeft = side === 'left';

  return (
    <div style={{
      position: 'fixed',
      left: isLeft ? 0 : 'auto',
      right: isLeft ? 'auto' : 0,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 40,
    }}>
      <Link href={`/realisations/${project.slug}`} style={{ textDecoration: 'none' }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            background: hovered ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(6px)',
            border: `1px solid ${hovered ? 'rgba(10,22,40,0.18)' : 'rgba(10,22,40,0.1)'}`,
            borderRadius: isLeft ? '0 6px 6px 0' : '6px 0 0 6px',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
          }}
        >
          {!isLeft && hovered && (
            <>
              <div style={{ textAlign: 'right', padding: '0.6rem 0 0.6rem 0.7rem' }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00a3ff' }}>
                  {project.category}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0a1628', maxWidth: '160px', lineHeight: 1.3 }}>
                  {project.title}
                </div>
              </div>
              <div style={{ width: '1px', background: 'rgba(10,22,40,0.12)', alignSelf: 'stretch', margin: '0 0.6rem' }} />
            </>
          )}

          <span style={{ color: '#0a1628', fontSize: '1.1rem', padding: '0.85rem 0.7rem', lineHeight: 1, flexShrink: 0 }}>
            {isLeft ? '←' : '→'}
          </span>

          {isLeft && hovered && (
            <>
              <div style={{ width: '1px', background: 'rgba(10,22,40,0.12)', alignSelf: 'stretch', margin: '0 0.6rem' }} />
              <div style={{ padding: '0.6rem 0.7rem 0.6rem 0' }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00a3ff' }}>
                  {project.category}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0a1628', maxWidth: '160px', lineHeight: 1.3 }}>
                  {project.title}
                </div>
              </div>
            </>
          )}
        </div>
      </Link>
    </div>
  );
}

export default function ProjectNavArrows({ prevProject, nextProject }) {
  return (
    <>
      <Arrow project={prevProject} side="left" />
      <Arrow project={nextProject} side="right" />
    </>
  );
}
