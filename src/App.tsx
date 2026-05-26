import { useEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScanlineOverlay from '@/components/layout/ScanlineOverlay';
import { trackPageView } from '@/lib/analytics';

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
      <div className="min-h-screen flex flex-col">
        <ScanlineOverlay />
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
        <Footer />
      </div>
    </HelmetProvider>
  );
}
