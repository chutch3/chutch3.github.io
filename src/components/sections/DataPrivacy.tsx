import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const concerns = [
  'Data minimization — collect only what you need',
  'Transparency in ML systems and training data provenance',
  'Right to deletion and meaningful user consent',
  'Privacy-preserving ML techniques (federated learning, differential privacy)',
  'Fighting the normalization of surveillance capitalism',
];

export default function DataPrivacy() {
  const { ref: listRef, isVisible: listVisible } = useScrollReveal();

  return (
    <section className="py-24 px-6 glow-pink noise-bg">
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
            build — and how easily the people behind that data can be forgotten.
            Data privacy isn't just a compliance checkbox. It's a question of
            respect.
          </p>

          <p>
            Every model trained, every pipeline deployed, every feature
            engineered starts with someone's information. I believe we have a
            responsibility to treat that data with care — to minimize
            collection, to be transparent about usage, and to give people
            meaningful control over their own information.
          </p>

          <div
            ref={listRef}
            className="border border-cyber-border rounded-lg p-6 bg-cyber-surface/50"
          >
            <p className="font-heading text-sm text-cyber-pink uppercase tracking-wider mb-3">
              Things I care about
            </p>
            <ul className="space-y-2 text-sm">
              {concerns.map((concern, i) => (
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
            More thoughts on this topic coming soon in the blog section. This is
            something I want to write more about.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
