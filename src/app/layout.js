import { Barlow, Barlow_Condensed } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/layout/SmoothScroll';
import PageTransition from '@/components/layout/PageTransition';
import SiteIntro from '@/components/layout/SiteIntro';
import SiteIntroLogo from '@/components/layout/SiteIntroLogo';
import './globals.css';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-barlow-condensed',
});

export const metadata = {
  title: 'ATNER — Atlas Énergie',
  description:
    'Leader national dans les services de l\'électricité, de l\'énergie et des travaux publics au Maroc.',
  icons: {
    icon: '/favicon.ico',
    // apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body suppressHydrationWarning>
        <SiteIntro />
        <SiteIntroLogo />
        <div id="page-content">
          <SmoothScroll>
            <Navbar />
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
            <Footer />
          </SmoothScroll>
        </div>
      </body>
    </html>
  );
}
