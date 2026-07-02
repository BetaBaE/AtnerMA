'use client';
import dynamic from 'next/dynamic';

const ProjectMap = dynamic(() => import('./ProjectMap'), { ssr: false });

export default function ProjectMapWrapper(props) {
  return <ProjectMap {...props} />;
}
