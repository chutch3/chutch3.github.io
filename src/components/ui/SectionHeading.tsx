interface SectionHeadingProps {
  title: string;
  jpTitle?: string;
  className?: string;
}

export default function SectionHeading({
  title,
  jpTitle,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${className}`}>
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-cyber-cyan uppercase tracking-wider">
        {title}
      </h2>
      {jpTitle && (
        <p className="font-jp text-cyber-muted text-sm mt-1 tracking-wide">
          {jpTitle}
        </p>
      )}
      <div className="mt-4 h-px w-24 bg-gradient-to-r from-cyber-cyan via-cyber-pink to-transparent" />
    </div>
  );
}
