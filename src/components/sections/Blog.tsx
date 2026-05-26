import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { siteConfig } from '@/config/site.config';

export default function Blog() {
  return (
    <section className="py-24 px-6 glow-cyan noise-bg">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title={siteConfig.sections.blog.title}
          jpTitle={siteConfig.sections.blog.jp}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center py-16"
        >
          <div className="inline-block border border-cyber-border rounded-lg p-10 bg-cyber-surface/30">
            <div className="font-mono text-sm text-cyber-muted space-y-2">
              <p>
                <span className="text-cyber-cyan">$</span> cat ./blog/status
              </p>
              <p className="text-cyber-text">Setting up the CMS...</p>
              <p>
                <span className="text-cyber-cyan">$</span>{' '}
                <span className="cursor-blink">_</span>
              </p>
            </div>
            <p className="text-cyber-muted text-sm mt-6">
              Blog posts are coming soon. I'll be writing about data privacy, ML
              engineering, and whatever else is on my mind.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
