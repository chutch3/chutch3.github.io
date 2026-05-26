import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function About() {
  const { ref: interestsRef, isVisible: interestsVisible } = useScrollReveal();

  return (
    <section className="py-24 px-6 glow-cyan noise-bg">
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
            , where I work on LLM-powered clinical AI. Before that — Perennial,
            Ontra, Drizly, and a long run at Humana. Georgia Tech MS in CS (ML).
            I've spent the last decade building ML systems end-to-end, and the
            current wave of LLMs and agentic tooling is the most interesting
            this work has ever been.
          </p>

          <p>
            I think a lot about{' '}
            <span className="text-cyber-pink">data privacy</span> — especially
            now that LLMs are vacuuming up data at a scale we've never seen. How
            we build these systems matters.
          </p>

          <p>
            Outside of work I run a{' '}
            <a
              href="https://github.com/chutch3/homelab"
              target="_blank"
              rel="noreferrer"
              className="text-cyber-cyan hover:neon-cyan transition-all"
            >
              homelab
            </a>
            , build side projects with{' '}
            <a
              href="https://github.com/chutch3/real-estate-agent-tools"
              target="_blank"
              rel="noreferrer"
              className="text-cyber-cyan hover:neon-cyan transition-all"
            >
              LLM agents
            </a>
            , and watch a probably unhealthy amount of anime.
          </p>

          <div
            ref={interestsRef}
            className={`pt-4 border-t border-cyber-border transition-all duration-700 ${interestsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
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
