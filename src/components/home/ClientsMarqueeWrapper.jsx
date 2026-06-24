'use client';
import dynamic from 'next/dynamic';

const ClientsMarquee = dynamic(() => import('./ClientsMarquee'), { ssr: false });

export default function ClientsMarqueeWrapper(props) {
  return <ClientsMarquee {...props} />;
}
