import { motion } from 'framer-motion';
import GlitchText from '@/components/ui/GlitchText';
import NeonButton from '@/components/ui/NeonButton';
import { siteConfig } from '@/config/site.config';
import { trackEvent } from '@/lib/analytics';

export default function Hero() {
  return (
    <section className="relative h-[calc(100dvh-4rem)] flex flex-col items-center justify-center px-6 grid-bg noise-bg overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyber-cyan/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cyber-pink/[0.02] rounded-full blur-[100px] pointer-events-none" />
      {/* Decorative corner accents */}
      <div className="absolute top-24 left-6 w-16 h-16 border-l border-t border-cyber-cyan/20" />
      <div className="absolute bottom-12 right-6 w-16 h-16 border-r border-b border-cyber-pink/20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center -mt-8 md:-mt-12"
      >
        {/* Japanese subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-jp text-cyber-muted text-sm tracking-[0.3em] mb-4"
        >
          {siteConfig.jpTagline}
        </motion.p>

        {/* Name */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider mb-4 md:mb-6">
          <GlitchText text={siteConfig.name} className="text-cyber-text" />
        </h1>

        {/* Title line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-5 md:mb-8"
        >
          <div className="h-px w-12 bg-cyber-cyan/50" />
          <p className="font-mono text-sm text-cyber-cyan tracking-widest uppercase">
            {siteConfig.title}
          </p>
          <div className="h-px w-12 bg-cyber-cyan/50" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-cyber-muted max-w-lg mx-auto mb-6 md:mb-10 text-sm leading-relaxed"
        >
          {siteConfig.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <NeonButton to="/about" variant="cyan">
            Enter
          </NeonButton>
          <NeonButton
            href={siteConfig.resume.url}
            variant="pink"
            external
            onClick={() => trackEvent('view-resume', 'Hero Resume Button')}
          >
            View Resume
          </NeonButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
