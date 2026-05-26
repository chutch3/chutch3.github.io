import { useEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScanlineOverlay from '@/components/layout/ScanlineOverlay';
import { trackPageView } from '@/lib/analytics';
import PixelMascot from '@/components/ui/PixelMascot';
import EasterEggs from '@/components/ui/EasterEggs';
import { siteConfig } from '@/config/site.config';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

function FrozenOutlet() {
  const outlet = useOutlet();
  const frozenRef = useRef(outlet);
  // Update ref only when we get a new non-null outlet (i.e. on mount, not during exit)
  if (outlet) {
    frozenRef.current = outlet;
  }
  return frozenRef.current;
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{siteConfig.seo.title}</title>
        <meta name="description" content={siteConfig.seo.description} />
        <meta property="og:title" content={siteConfig.seo.title} />
        <meta property="og:description" content={siteConfig.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.seo.url} />
        <script
          data-goatcounter={`https://${siteConfig.goatcounter.siteCode}.goatcounter.com/count`}
          async
          src="//gc.zgo.at/count.js"
        />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        {siteConfig.features.scanlines && <ScanlineOverlay />}
        <Navbar />
        <main className="flex-1 pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <FrozenOutlet />
            </motion.div>
          </AnimatePresence>
        </main>
        {location.pathname !== '/' && <Footer />}
        {siteConfig.features.mascot && <PixelMascot />}
        {siteConfig.features.easterEggs && <EasterEggs />}
      </div>
    </HelmetProvider>
  );
}
