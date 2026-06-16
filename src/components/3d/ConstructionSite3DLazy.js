'use client';

import dynamic from 'next/dynamic';

// `next/dynamic` with `ssr: false` must be called from a Client Component —
// this wrapper exists so Server Components (e.g. app/realisations/page.js)
// can still lazy-load the (heavy, browser-only) ConstructionSite3D viewer.
const ConstructionSite3D = dynamic(() => import('./ConstructionSite3D'), { ssr: false });

export default ConstructionSite3D;
