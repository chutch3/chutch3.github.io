import { type ReactNode } from 'react';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
}

export default function NeonCard({
  children,
  className = '',
  animated = false,
}: NeonCardProps) {
  if (animated) {
    return (
      <div className={`animated-border rounded-lg ${className}`}>
        <div className="bg-cyber-surface rounded-lg p-6">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={`bg-cyber-surface border border-cyber-border rounded-lg p-6 transition-all duration-300 hover:border-cyber-cyan/30 hover:shadow-[0_0_20px_rgba(0,245,255,0.05)] ${className}`}
    >
      {children}
    </div>
  );
}
