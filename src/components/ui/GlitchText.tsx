interface GlitchTextProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function GlitchText({
  text,
  className = '',
  as: Tag = 'span',
}: GlitchTextProps) {
  return (
    <Tag className={`relative inline-block ${className}`}>
      <span className="glitch-layer glitch-layer-cyan" aria-hidden="true">
        {text}
      </span>
      <span className="glitch-layer glitch-layer-pink" aria-hidden="true">
        {text}
      </span>
      {text}
    </Tag>
  );
}
