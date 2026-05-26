import { motion } from 'framer-motion';
import { HiExternalLink } from 'react-icons/hi';
import SectionHeading from '@/components/ui/SectionHeading';
import NeonButton from '@/components/ui/NeonButton';
import SkillBadge from '@/components/ui/SkillBadge';
import { siteConfig } from '@/config/site.config';
import { trackEvent } from '@/lib/analytics';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { CompanyStage } from '@/types';

const skillCategories = [
  { key: 'core', label: 'ML / AI' },
  { key: 'languages', label: 'Languages' },
  { key: 'data', label: 'Data' },
  { key: 'cloud', label: 'Cloud' },
  { key: 'frameworks', label: 'Frameworks' },
  { key: 'tools', label: 'Tools' },
] as const;

const stageStyles: Record<CompanyStage, string> = {
  'Series A': 'border-cyber-cyan/40 text-cyber-cyan/70',
  'Series B': 'border-cyber-cyan/40 text-cyber-cyan/70',
  Unicorn: 'border-cyber-yellow/40 text-cyber-yellow/70',
  Acquired: 'border-cyber-purple/40 text-cyber-purple/70',
  'Fortune 50': 'border-cyber-pink/40 text-cyber-pink/70',
  Public: 'border-cyber-pink/40 text-cyber-pink/70',
};

export default function Resume() {
  const { ref: eduRef, isVisible: eduVisible } = useScrollReveal();
  const { ref: skillsRef, isVisible: skillsVisible } = useScrollReveal();

  return (
    <section className="py-24 px-6 glow-cyan noise-bg">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title={siteConfig.sections.resume.title}
          jpTitle={siteConfig.sections.resume.jp}
        />

        {/* View Resume CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <NeonButton
            href={siteConfig.resume.url}
            variant="cyan"
            external
            onClick={() => trackEvent('view-resume', 'View Full Resume')}
          >
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
                transition={{ duration: 0.4, delay: 0.2 + i * 0.12 }}
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
                <div className="flex items-center gap-2 mt-0.5">
                  <a
                    href={exp.companyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm text-cyber-pink hover:neon-pink transition-all"
                  >
                    {exp.company}
                  </a>
                  {exp.stage && (
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[10px] font-heading uppercase tracking-wider border rounded-sm ${stageStyles[exp.stage]}`}
                    >
                      {exp.stage}
                    </span>
                  )}
                </div>
                {exp.summary && (
                  <p className="text-sm text-cyber-text/50 mt-1.5">
                    {exp.summary}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div ref={eduRef} className="mb-16">
          <h3 className="font-heading text-lg text-cyber-text uppercase tracking-wider mb-8">
            Education
          </h3>
          <div className="space-y-6">
            {siteConfig.educations.map((edu, i) => (
              <div
                key={edu.institution}
                className={`border-l-2 border-cyber-pink/50 pl-6 transition-all duration-700 ${
                  eduVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: eduVisible ? `${i * 150}ms` : '0ms' }}
              >
                <h4 className="font-body font-semibold text-cyber-text">
                  {edu.institution}
                </h4>
                <p className="text-sm text-cyber-text/70 mt-1">{edu.degree}</p>
                <p className="font-mono text-xs text-cyber-muted mt-1">
                  {edu.from} — {edu.to}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div ref={skillsRef}>
          <h3 className="font-heading text-lg text-cyber-text uppercase tracking-wider mb-8">
            Skills
          </h3>
          <div className="space-y-6">
            {skillCategories.map(({ key, label }, catIndex) => {
              const skills = siteConfig.skills.filter(
                (s) => s.category === key,
              );
              if (skills.length === 0) return null;
              return (
                <div
                  key={key}
                  className={`transition-all duration-700 ${
                    skillsVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: skillsVisible
                      ? `${catIndex * 100}ms`
                      : '0ms',
                  }}
                >
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
