import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

export default function About() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeading title="About" jpTitle="自己紹介" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 text-cyber-text/80 leading-relaxed"
        >
          <p>
            ML engineer at{' '}
            <a
              href="https://www.smarterdx.com/"
              target="_blank"
              rel="noreferrer"
              className="text-cyber-cyan hover:neon-cyan transition-all"
            >
              SmarterDx
            </a>
            . Before that, Perennial, Ontra, Drizly, and a long run at Humana.
            Georgia Tech MS in CS (ML). I like building things end-to-end —
            the model, the infra, the pipeline, the deploy.
          </p>

          <p>
            I think a lot about{' '}
            <span className="text-cyber-pink">data privacy</span> and
            how careless most software is with the people behind the data.
            It's something I want to write more about.
          </p>

          <p>
            Outside of work I run a{' '}
            <a href="https://github.com/chutch3/homelab" target="_blank" rel="noreferrer" className="text-cyber-cyan hover:neon-cyan transition-all">homelab</a>,
            watch a probably unhealthy amount of anime, and tinker with
            whatever sounds interesting.
          </p>

          <div className="pt-4 border-t border-cyber-border">
            <p className="font-mono text-xs text-cyber-muted">
              <span className="text-cyber-cyan">$</span> cat /etc/interests
            </p>
            <p className="font-mono text-xs text-cyber-muted mt-1">
              ml, data_privacy, anime, homelab, open_source
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
