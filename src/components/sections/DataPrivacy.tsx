import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { siteConfig } from '@/config/site.config';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function DataPrivacy() {
  const { ref: listRef, isVisible: listVisible } = useScrollReveal();

  return (
    <section className="py-24 px-6 glow-pink noise-bg">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          title={siteConfig.sections.privacy.title}
          jpTitle={siteConfig.sections.privacy.jp}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 text-cyber-text/80 leading-relaxed"
        >
          {siteConfig.privacy.paragraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}

          <div
            ref={listRef}
            className="border border-cyber-border rounded-lg p-6 bg-cyber-surface/50"
          >
            <p className="font-heading text-sm text-cyber-pink uppercase tracking-wider mb-3">
              Things I care about
            </p>
            <ul className="space-y-2 text-sm">
              {siteConfig.privacy.concerns.map((concern, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 transition-all duration-500 ${
                    listVisible
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-4'
                  }`}
                  style={{
                    transitionDelay: listVisible ? `${i * 100}ms` : '0ms',
                  }}
                >
                  <span className="text-cyber-cyan mt-0.5">▹</span>
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-cyber-muted text-sm italic">
            {siteConfig.privacy.footer}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
