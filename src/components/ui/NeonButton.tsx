import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NeonButtonProps {
  children: ReactNode;
  href?: string;
  to?: string;
  variant?: 'cyan' | 'pink' | 'yellow';
  className?: string;
  external?: boolean;
  onClick?: () => void;
}

const variantStyles = {
  cyan: 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.3)]',
  pink: 'border-cyber-pink text-cyber-pink hover:bg-cyber-pink/10 hover:shadow-[0_0_15px_rgba(255,45,123,0.3)]',
  yellow:
    'border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow/10 hover:shadow-[0_0_15px_rgba(245,255,0,0.3)]',
};

export default function NeonButton({
  children,
  href,
  to,
  variant = 'cyan',
  className = '',
  external = false,
  onClick,
}: NeonButtonProps) {
  const baseClasses = `inline-flex items-center gap-2 px-6 py-3 border font-heading text-sm uppercase tracking-widest transition-all duration-300 ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={baseClasses} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {children}
    </button>
  );
}
