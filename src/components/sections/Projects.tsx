import { motion } from 'framer-motion';
import { HiExternalLink } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import SectionHeading from '@/components/ui/SectionHeading';
import NeonCard from '@/components/ui/NeonCard';
import SkillBadge from '@/components/ui/SkillBadge';
import { projects } from '@/config/projects.config';

export default function Projects() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="Projects" jpTitle="プロジェクト" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className={project.featured ? 'md:col-span-2' : ''}
            >
              <NeonCard animated={project.featured}>
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
        </div>

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
