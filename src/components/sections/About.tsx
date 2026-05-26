import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { siteConfig } from '@/config/site.config';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function About() {
  const { ref: interestsRef, isVisible: interestsVisible } = useScrollReveal();

  return (
    <section className="py-24 px-6 glow-cyan noise-bg">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          title={siteConfig.sections.about.title}
          jpTitle={siteConfig.sections.about.jp}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 text-cyber-text/80 leading-relaxed"
        >
          {siteConfig.about.paragraphs.map((html, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
          ))}

          <div
            ref={interestsRef}
            className={`pt-4 border-t border-cyber-border transition-all duration-700 ${interestsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <p className="font-mono text-xs text-cyber-muted">
              <span className="text-cyber-cyan">$</span> cat /etc/interests
            </p>
            <p className="font-mono text-xs text-cyber-muted mt-1">
              {siteConfig.about.interests.join(', ')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
