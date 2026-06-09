'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePageTransitionLink } from '@/components/layout/PageTransition';

const DISP_SRC = 'https://res.cloudinary.com/joostkiens/image/upload/v1549447783/codepen/displacement_map_2.png';

export default function ProjectsClient({ projects }) {
  const router   = useRouter();
  const navigate = usePageTransitionLink();
  const wrapRef  = useRef(null);
  const pixiRef  = useRef(null); // { app, imgSprite, dispSprite, dispFilter, PIXI }
  const rafRef   = useRef(null);
  const navRef   = useRef(null);
  const animRef  = useRef(null); // cancel any in-progress fade

  const categories = ['Tous', ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [hoveredIdx,   setHoveredIdx]   = useState(null);
  const [zooming,      setZooming]      = useState(false); // lock list during zoom

  const filtered = activeFilter === 'Tous'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  // ── Bootstrap Pixi once ─────────────────────────────────
  useEffect(() => {
    let destroyed = false;

    rafRef.current = requestAnimationFrame(async () => {
      const PIXI = await import('pixi.js');
      const wrap = wrapRef.current;
      if (!wrap || destroyed) return;

      const w = wrap.offsetWidth  || window.innerWidth;
      const h = wrap.offsetHeight || window.innerHeight;

      const app = new PIXI.Application();
      await app.init({
        width:           w,
        height:          h,
        backgroundAlpha: 0,
        antialias:       true,
        autoDensity:     true,
        resolution:      window.devicePixelRatio || 1,
      });

      // Mount the canvas
      wrap.appendChild(app.canvas);
      app.canvas.style.cssText =
        'position:absolute;inset:0;width:100%!important;height:100%!important;pointer-events:none;z-index:0;';

      // Image sprite — starts invisible, centered, half-scale (like the original)
      const imgSprite = new PIXI.Sprite();
      imgSprite.anchor.set(0.5);
      imgSprite.x     = w / 2;
      imgSprite.y     = h / 2;
      imgSprite.alpha = 0;
      app.stage.addChild(imgSprite);

      // Displacement sprite
      let dispSprite = null;
      let dispFilter = null;
      try {
        const dispTex  = await PIXI.Assets.load(DISP_SRC);
        dispSprite     = new PIXI.Sprite(dispTex);
        dispSprite.anchor.set(0.5);
        dispSprite.x   = w / 2;
        dispSprite.y   = h / 2;
        // match original: scale.y *= height / width
        dispSprite.scale.y = dispSprite.scale.y * (h / w);
        app.stage.addChild(dispSprite);

        dispFilter = new PIXI.DisplacementFilter({ sprite: dispSprite, scale: 0 });
        app.stage.filters = [dispFilter];
      } catch { /* no displacement — degrade */ }

      const onResize = () => {
        const nw = wrap.offsetWidth;
        const nh = wrap.offsetHeight;
        app.renderer.resize(nw, nh);
        imgSprite.x = nw / 2;
        imgSprite.y = nh / 2;
        if (dispSprite) {
          dispSprite.x   = nw / 2;
          dispSprite.y   = nh / 2;
          dispSprite.scale.y = dispSprite.scale.x * (nh / nw);
        }
        // Re-fit if sprite is already loaded
        if (imgSprite.texture?.width) fitSprite(imgSprite, nw, nh);
      };
      window.addEventListener('resize', onResize);

      pixiRef.current = { app, imgSprite, dispSprite, dispFilter, PIXI, onResize };
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafRef.current);
      const p = pixiRef.current;
      if (p) {
        window.removeEventListener('resize', p.onResize);
        // Remove canvas from DOM before destroying
        if (p.app.canvas?.parentNode) p.app.canvas.parentNode.removeChild(p.app.canvas);
        p.app.destroy(true, { children: true });
        pixiRef.current = null;
      }
    };
  }, []);

  // ── Swap image on hover ──────────────────────────────────
  useEffect(() => {
    if (zooming) return; // don't swap during zoom animation

    const p = pixiRef.current;
    if (!p) return;

    const { app, imgSprite, dispFilter, PIXI } = p;
    const project = hoveredIdx !== null ? filtered[hoveredIdx] : null;

    // Cancel any previous fade
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }

    if (!project?.coverImage?.url) {
      animRef.current = fadeAlpha(imgSprite, 0, 300, (id) => { animRef.current = id; });
      return;
    }

    async function swap() {
      try {
        const tex = await PIXI.Assets.load(project.coverImage.url);
        if (!pixiRef.current || zooming) return;
        imgSprite.texture = tex;

        // Fill the full canvas
        fitSprite(imgSprite, app.screen.width, app.screen.height);
        imgSprite.x = app.screen.width  / 2;
        imgSprite.y = app.screen.height / 2;

        if (dispFilter) { dispFilter.scale.x = 0; dispFilter.scale.y = 0; }
        animRef.current = fadeAlpha(imgSprite, 1, 350, (id) => { animRef.current = id; });
      } catch { /* no image */ }
    }
    swap();
  }, [hoveredIdx, filtered, zooming]);

  // ── Click: zoom + ripple then navigate ─────────────────
  const handleClick = useCallback((e, slug, idx) => {
    const p = pixiRef.current;
    if (!p || !p.dispFilter || !p.imgSprite.texture?.width) {
      navigate(`/realisations/${slug}`);
      return;
    }

    setZooming(true);
    navRef.current = slug;

    const { app, imgSprite, dispSprite, dispFilter } = p;
    const wrap   = wrapRef.current;
    const rect   = wrap.getBoundingClientRect();
    const cx     = e.clientX - rect.left;
    const cy     = e.clientY - rect.top;
    const w      = app.screen.width;
    const h      = app.screen.height;
    const screenRatio = h / w;

    // Same math as original
    const maxX = cx - w / 2 > 0 ? cx : w - cx;
    const maxY = cy - h / 2 > 0 ? cy : h - cy;
    const rippleDiameter = Math.sqrt(maxX * maxX + maxY * maxY) * 2;
    const maxScale = rippleDiameter / 100;

    // Move displacement sprite to click position (like original set pixi pos)
    if (dispSprite) {
      dispSprite.x = cx;
      dispSprite.y = cy;
      dispFilter.scale.x = 0;
      dispFilter.scale.y = 0;
    }

    const dur   = 1200;
    const start = performance.now();

    function tick(now) {
      const t  = Math.min((now - start) / dur, 1);
      const et = easeOutBounce(t);

      // Ripple spreads from click point — image stays fixed
      if (dispFilter && dispSprite) {
        dispFilter.scale.x = et * maxScale * 350 + 10;
        dispFilter.scale.y = et * maxScale * 350 * screenRatio + 10;
        dispSprite.scale.x = et * maxScale;
        dispSprite.scale.y = et * maxScale * screenRatio;
      }

      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        navigate(`/realisations/${navRef.current}`);
      }
    }
    animRef.current = requestAnimationFrame(tick);
  }, [navigate]);

  return (
    <>
      <style>{`
        .pc-wrap {
          position: relative;
          min-height: 100vh;
          background: #0a0e18;
          overflow: hidden;
        }
        /* vignette so left text stays readable */
        .pc-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(6,14,28,0.95) 0%,
            rgba(6,14,28,0.7) 40%,
            rgba(6,14,28,0.1) 70%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 1;
        }
        .pc-ui {
          position: relative;
          z-index: 2;
          padding: 5rem 3.5rem;
          max-width: 660px;
          pointer-events: ${zooming ? 'none' : 'auto'};
          opacity: ${zooming ? '0.4' : '1'};
          transition: opacity 0.3s;
        }
        /* Filter */
        .pc-filter-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 3.5rem;
        }
        .pc-filter-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
          margin-right: 0.4rem;
        }
        .pc-filter-btn {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.35rem 0.9rem;
          border-radius: 3px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.18s;
        }
        .pc-filter-btn:hover  { border-color: rgba(255,255,255,0.28); color: #fff; }
        .pc-filter-btn.active { background: #00a3ff; border-color: #00a3ff; color: #fff; }
        /* Project list */
        .pc-list { list-style: none; }
        .pc-item {
          border-top: 1px solid rgba(255,255,255,0.055);
          cursor: pointer;
        }
        .pc-item:last-child { border-bottom: 1px solid rgba(255,255,255,0.055); }
        .pc-item-inner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem 0;
          text-decoration: none;
          color: inherit;
        }
        .pc-item-num {
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.15);
          min-width: 2rem;
        }
        .pc-item-info { flex: 1; display: flex; flex-direction: column; gap: 0.18rem; }
        .pc-item-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1rem, 1.7vw, 1.38rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.4);
          transition: color 0.2s;
          line-height: 1.1;
        }
        .pc-item:hover .pc-item-title { color: #fff; }
        .pc-item-meta {
          font-size: 0.68rem;
          color: rgba(255,255,255,0.18);
          transition: color 0.2s;
          display: flex;
          gap: 0.6rem;
        }
        .pc-item:hover .pc-item-meta { color: rgba(255,255,255,0.45); }
        .pc-item-right {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }
        .pc-item-badge {
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(0,163,255,0.1);
          color: rgba(0,163,255,0.6);
          border: 1px solid rgba(0,163,255,0.18);
          padding: 0.18rem 0.5rem;
          border-radius: 2px;
          transition: all 0.18s;
        }
        .pc-item:hover .pc-item-badge { background: rgba(0,163,255,0.22); color: #00a3ff; }
        .pc-arrow {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.1);
          transition: color 0.2s, transform 0.2s;
        }
        .pc-item:hover .pc-arrow { color: #fff; transform: translateX(5px); }
        .pc-empty {
          padding: 4rem 0;
          color: rgba(255,255,255,0.22);
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .pc-ui { padding: 3.5rem 1.5rem; max-width: 100%; }
        }
      `}</style>

      <div className="pc-wrap" ref={wrapRef}>
        {/* PixiJS canvas injected by effect */}
        <div className="pc-vignette" />

        <div className="pc-ui">
          {/* Filter bar */}
          <div className="pc-filter-bar">
            <span className="pc-filter-label">Filtrer :</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`pc-filter-btn${activeFilter === cat ? ' active' : ''}`}
                onClick={() => { setActiveFilter(cat); setHoveredIdx(null); }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project list */}
          {filtered.length > 0 ? (
            <ul className="pc-list">
              {filtered.map((p, i) => (
                <li
                  key={p.slug}
                  className="pc-item"
                  onMouseEnter={() => !zooming && setHoveredIdx(i)}
                  onMouseLeave={() => !zooming && setHoveredIdx(null)}
                  onClick={(e) => handleClick(e, p.slug, i)}
                >
                  <div className="pc-item-inner">
                    <span className="pc-item-num">{String(i + 1).padStart(2, '0')}</span>
                    <div className="pc-item-info">
                      <span className="pc-item-title">{p.title}</span>
                      <div className="pc-item-meta">
                        {p.region && <span>{p.region}</span>}
                        {p.client && <span>{p.client}</span>}
                        {p.year   && <span>{p.year}</span>}
                      </div>
                    </div>
                    <div className="pc-item-right">
                      {p.category && <span className="pc-item-badge">{p.category}</span>}
                      <span className="pc-arrow">→</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="pc-empty">Aucun projet pour ce filtre.</div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

// Fit sprite to cover w×h, return the scale used
function fitSprite(sprite, w, h) {
  if (!sprite.texture?.width) return;
  const scale = Math.max(w / sprite.texture.width, h / sprite.texture.height);
  sprite.scale.set(scale);
}

// Animate alpha, calls onTick with the rAF id so caller can cancel
function fadeAlpha(target, to, ms, onTick) {
  const from  = target.alpha;
  const start = performance.now();
  let id;
  function tick(now) {
    const t = Math.min((now - start) / ms, 1);
    target.alpha = from + (to - from) * easeOutPower2(t);
    if (t < 1) { id = requestAnimationFrame(tick); onTick?.(id); }
  }
  id = requestAnimationFrame(tick);
  onTick?.(id);
}

// easeOut cubic — used for image zoom
function easeOutPower2(t) { return 1 - Math.pow(1 - t, 2); }

// Bounce ease — faithful to original Bounce.easeOut for the displacement ripple
function easeOutBounce(t) {
  const n1 = 7.5625, d1 = 2.75;
  if (t < 1 / d1)       return n1 * t * t;
  if (t < 2 / d1)       return n1 * (t -= 1.5   / d1) * t + 0.75;
  if (t < 2.5 / d1)     return n1 * (t -= 2.25  / d1) * t + 0.9375;
  return                        n1 * (t -= 2.625 / d1) * t + 0.984375;
}
