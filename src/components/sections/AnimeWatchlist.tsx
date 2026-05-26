import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import NeonCard from '@/components/ui/NeonCard';
import AnimeBadge from '@/components/ui/AnimeBadge';
import { siteConfig } from '@/config/site.config';
import { trackEvent } from '@/lib/analytics';
import type { AnimeEntry, WatchStatus } from '@/types';

type FilterOption = 'all' | WatchStatus;

const filters: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'watching', label: 'Watching' },
  { key: 'completed', label: 'Completed' },
  { key: 'plan-to-watch', label: 'Plan to Watch' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-xs text-cyber-yellow">{rating}</span>
      <span className="text-cyber-yellow text-xs">/10</span>
    </div>
  );
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function AnimeWatchlist() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const animeList = siteConfig.anime as AnimeEntry[];
  const filtered =
    activeFilter === 'all'
      ? animeList
      : animeList.filter((a) => a.status === activeFilter);

  return (
    <section className="py-24 px-6 glow-purple noise-bg">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title={siteConfig.sections.anime.title}
          jpTitle={siteConfig.sections.anime.jp}
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setActiveFilter(key);
                trackEvent(`anime-filter-${key}`, label);
              }}
              className={`px-4 py-2 text-xs font-heading uppercase tracking-widest border transition-all duration-300 ${
                activeFilter === key
                  ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/5 shadow-[0_0_10px_rgba(0,245,255,0.15)]'
                  : 'border-cyber-border text-cyber-muted hover:border-cyber-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Anime grid — keyed on filter to re-trigger stagger */}
        <motion.div
          key={activeFilter}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((anime) => (
            <motion.div key={anime.title} variants={item}>
              <NeonCard className="h-full">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-body font-semibold text-cyber-text text-sm">
                        {anime.url ? (
                          <a
                            href={anime.url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-cyber-cyan transition-colors"
                          >
                            {anime.title}
                          </a>
                        ) : (
                          anime.title
                        )}
                      </h3>
                      {anime.titleJp && (
                        <p className="font-jp text-xs text-cyber-muted mt-0.5">
                          {anime.titleJp}
                        </p>
                      )}
                    </div>
                    <AnimeBadge status={anime.status} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-cyber-muted">
                    {anime.episodes && (
                      <span className="font-mono">{anime.episodes} eps</span>
                    )}
                    {anime.rating && <StarRating rating={anime.rating} />}
                  </div>

                  {anime.notes && (
                    <p className="text-xs text-cyber-text/50 italic">
                      {anime.notes}
                    </p>
                  )}
                </div>
              </NeonCard>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="font-mono text-cyber-muted text-sm">
              No entries match this filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
