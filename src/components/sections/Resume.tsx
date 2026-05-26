import { motion } from 'framer-motion';
import { HiExternalLink } from 'react-icons/hi';
import SectionHeading from '@/components/ui/SectionHeading';
import NeonButton from '@/components/ui/NeonButton';
import SkillBadge from '@/components/ui/SkillBadge';
import { siteConfig } from '@/config/site.config';

const skillCategories = [
  { key: 'core', label: 'ML / AI' },
  { key: 'languages', label: 'Languages' },
  { key: 'data', label: 'Data' },
  { key: 'cloud', label: 'Cloud' },
  { key: 'frameworks', label: 'Frameworks' },
  { key: 'tools', label: 'Tools' },
] as const;

export default function Resume() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="Resume" jpTitle="履歴書" />

        {/* View Resume CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <NeonButton href={siteConfig.resume.url} variant="cyan" external>
            <HiExternalLink size={16} />
            View Full Resume
          </NeonButton>
        </motion.div>

        {/* Experience Timeline */}
        <div className="mb-16">
          <h3 className="font-heading text-lg text-cyber-text uppercase tracking-wider mb-8">
            Experience
          </h3>
          <div className="relative pl-8 border-l border-cyber-border">
            {siteConfig.experiences.map((exp, i) => (
              <motion.div
                key={`${exp.company}-${exp.from}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative mb-10 last:mb-0"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[calc(2rem+4.5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_rgba(0,245,255,0.5)]" />

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                  <h4 className="font-body font-semibold text-cyber-text">
                    {exp.position}
                  </h4>
                  <span className="font-mono text-xs text-cyber-muted">
                    {exp.from} — {exp.to}
                  </span>
                </div>
                <a
                  href={exp.companyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm text-cyber-pink hover:neon-pink transition-all"
                >
                  {exp.company}
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-16">
          <h3 className="font-heading text-lg text-cyber-text uppercase tracking-wider mb-8">
            Education
          </h3>
          <div className="space-y-6">
            {siteConfig.educations.map((edu, i) => (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="border-l-2 border-cyber-pink/50 pl-6"
              >
                <h4 className="font-body font-semibold text-cyber-text">
                  {edu.institution}
                </h4>
                <p className="text-sm text-cyber-text/70 mt-1">{edu.degree}</p>
                <p className="font-mono text-xs text-cyber-muted mt-1">
                  {edu.from} — {edu.to}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div>
          <h3 className="font-heading text-lg text-cyber-text uppercase tracking-wider mb-8">
            Skills
          </h3>
          <div className="space-y-6">
            {skillCategories.map(({ key, label }) => {
              const skills = siteConfig.skills.filter((s) => s.category === key);
              if (skills.length === 0) return null;
              return (
                <div key={key}>
                  <p className="font-mono text-xs text-cyber-muted mb-3 uppercase tracking-wider">
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <SkillBadge key={skill.name} name={skill.name} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
