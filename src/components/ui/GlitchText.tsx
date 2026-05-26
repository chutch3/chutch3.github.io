interface GlitchTextProps {
  text: string;
  className?: string;
  hoverOnly?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export default function GlitchText({
  text,
  className = '',
  hoverOnly = false,
  as: Tag = 'span',
}: GlitchTextProps) {
  return (
    <Tag
      className={`glitch ${hoverOnly ? 'glitch-hover' : ''} ${className}`}
      data-text={text}
    >
      {text}
    </Tag>
  );
}
