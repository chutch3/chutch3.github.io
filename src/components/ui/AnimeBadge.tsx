import type { WatchStatus } from '@/types';

const statusConfig: Record<WatchStatus, { label: string; color: string }> = {
  watching: { label: 'Watching', color: 'text-cyber-cyan border-cyber-cyan' },
  completed: { label: 'Completed', color: 'text-cyber-pink border-cyber-pink' },
  'plan-to-watch': { label: 'Plan to Watch', color: 'text-cyber-yellow border-cyber-yellow' },
  dropped: { label: 'Dropped', color: 'text-cyber-muted border-cyber-muted' },
  'on-hold': { label: 'On Hold', color: 'text-cyber-purple border-cyber-purple' },
};

interface AnimeBadgeProps {
  status: WatchStatus;
}

export default function AnimeBadge({ status }: AnimeBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-heading uppercase tracking-wider border rounded-sm ${config.color}`}
    >
      {config.label}
    </span>
  );
}
