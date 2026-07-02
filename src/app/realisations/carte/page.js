import { getAllProjects } from '@/lib/api';
import ProjectMapWrapper from '@/components/realisations/ProjectMapWrapper';

export const metadata = {
  title: 'Carte des Projets — AtnerMA',
};

export default async function CartePage() {
  const projects = await getAllProjects();
  return (
    <div style={{ height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
      <ProjectMapWrapper projects={projects} />
    </div>
  );
}
