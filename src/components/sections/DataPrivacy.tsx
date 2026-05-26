import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

export default function DataPrivacy() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeading title="Data Privacy" jpTitle="データプライバシー" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 text-cyber-text/80 leading-relaxed"
        >
          <p>
            As an ML engineer, I see firsthand how data powers the systems we
            build — and how easily the people behind that data can be
            forgotten. Data privacy isn't just a compliance checkbox. It's a
            question of respect.
          </p>

          <p>
            Every model trained, every pipeline deployed, every feature
            engineered starts with someone's information. I believe we have a
            responsibility to treat that data with care — to minimize
            collection, to be transparent about usage, and to give people
            meaningful control over their own information.
          </p>

          <div className="border border-cyber-border rounded-lg p-6 bg-cyber-surface/50">
            <p className="font-heading text-sm text-cyber-pink uppercase tracking-wider mb-3">
              Things I care about
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-cyber-cyan mt-0.5">▹</span>
                <span>Data minimization — collect only what you need</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyber-cyan mt-0.5">▹</span>
                <span>Transparency in ML systems and training data provenance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyber-cyan mt-0.5">▹</span>
                <span>Right to deletion and meaningful user consent</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyber-cyan mt-0.5">▹</span>
                <span>Privacy-preserving ML techniques (federated learning, differential privacy)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyber-cyan mt-0.5">▹</span>
                <span>Fighting the normalization of surveillance capitalism</span>
              </li>
            </ul>
          </div>

          <p className="text-cyber-muted text-sm italic">
            More thoughts on this topic coming soon in the blog section. This
            is something I want to write about regularly.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
