interface SkillBadgeProps {
  name: string;
  className?: string;
}

export default function SkillBadge({ name, className = '' }: SkillBadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-mono border border-cyber-border text-cyber-muted rounded-sm transition-all duration-300 hover:border-cyber-cyan hover:text-cyber-cyan hover:shadow-[0_0_8px_rgba(0,245,255,0.15)] ${className}`}
    >
      {name}
    </span>
  );
}
