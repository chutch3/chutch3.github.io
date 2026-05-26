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
            I'm a Senior Machine Learning Engineer currently at{' '}
            <a
              href="https://www.perennial.earth/"
              target="_blank"
              rel="noreferrer"
              className="text-cyber-cyan hover:neon-cyan transition-all"
            >
              Perennial
            </a>
            , where I build intelligent systems at the intersection of ML and
            geospatial data. My work spans the full ML lifecycle — from
            research and prototyping to production infrastructure.
          </p>

          <p>
            Before Perennial, I cut my teeth at companies like Drizly, Ontra,
            and Humana, working across recommendation systems, NLP, and
            large-scale data pipelines. I hold an MS in Computer Science from
            Georgia Tech with a specialization in Machine Learning.
          </p>

          <p>
            Beyond the day job, I care deeply about{' '}
            <span className="text-cyber-pink">data privacy</span> — how our
            data is collected, used, and often exploited. I believe engineers
            have a responsibility to build systems that respect the people who
            use them.
          </p>

          <p>
            When I'm not writing code or thinking about ML pipelines, you'll
            probably find me watching anime. I maintain a watchlist on this
            site because it's an important part of who I am — not just a hobby,
            but a medium that consistently challenges how I think about
            storytelling and human nature.
          </p>

          <div className="pt-4 border-t border-cyber-border">
            <p className="font-mono text-xs text-cyber-muted">
              <span className="text-cyber-cyan">$</span> cat /etc/interests
            </p>
            <p className="font-mono text-xs text-cyber-muted mt-1">
              machine_learning, data_privacy, anime, home_automation, open_source
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
