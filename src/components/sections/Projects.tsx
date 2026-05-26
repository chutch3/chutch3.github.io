import { motion } from 'framer-motion';
import { HiExternalLink } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import SectionHeading from '@/components/ui/SectionHeading';
import NeonCard from '@/components/ui/NeonCard';
import SkillBadge from '@/components/ui/SkillBadge';
import { projects } from '@/config/projects.config';
import { trackEvent } from '@/lib/analytics';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Projects() {
  return (
    <section className="py-24 px-6 glow-pink noise-bg">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="Projects" jpTitle="プロジェクト" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={item}
              className={project.featured ? 'md:col-span-2' : ''}
            >
              <NeonCard animated={project.featured} className="h-full">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-heading text-lg text-cyber-text font-semibold uppercase tracking-wide">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-3 shrink-0">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyber-muted hover:text-cyber-cyan transition-colors"
                          aria-label="View source"
                          onClick={() =>
                            trackEvent(
                              `project-github-${project.title.toLowerCase().replace(/\s+/g, '-')}`,
                              project.title,
                            )
                          }
                        >
                          <FaGithub size={16} />
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyber-muted hover:text-cyber-cyan transition-colors"
                          aria-label="View project"
                          onClick={() =>
                            trackEvent(
                              `project-link-${project.title.toLowerCase().replace(/\s+/g, '-')}`,
                              project.title,
                            )
                          }
                        >
                          <HiExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-cyber-text/70 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tech.map((t) => (
                      <SkillBadge key={t} name={t} />
                    ))}
                  </div>
                </div>
              </NeonCard>
            </motion.div>
          ))}
        </motion.div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="font-mono text-cyber-muted text-sm">
              <span className="text-cyber-cyan">$</span> ls ./projects
            </p>
            <p className="font-mono text-cyber-muted text-sm mt-1">
              Coming soon...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
