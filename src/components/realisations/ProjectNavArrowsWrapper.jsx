'use client';
import dynamic from 'next/dynamic';

const ProjectNavArrows = dynamic(() => import('./ProjectNavArrows'), { ssr: false });

export default function ProjectNavArrowsWrapper(props) {
  return <ProjectNavArrows {...props} />;
}
