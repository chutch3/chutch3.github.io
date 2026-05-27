import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import NeonCard from '@/components/ui/NeonCard';
import { siteConfig } from '@/config/site.config';

interface Monitor {
  id: number;
  name: string;
  type: string;
}

interface Heartbeat {
  status: number;
  time: string;
  ping: number;
}

interface MonitorGroup {
  id: number;
  name: string;
  monitorList: Monitor[];
}

interface StatusData {
  publicGroupList: MonitorGroup[];
  heartbeatList: Record<string, Heartbeat[]>;
  uptimeList: Record<string, number>;
}

type FetchState = 'loading' | 'online' | 'offline';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function StatusDot({ up }: { up: boolean }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${
        up
          ? 'bg-cyber-cyan shadow-[0_0_6px_rgba(0,245,255,0.5)]'
          : 'bg-cyber-pink shadow-[0_0_6px_rgba(255,45,123,0.5)]'
      }`}
    />
  );
}

function UptimeBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-cyber-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            percent >= 99
              ? 'bg-cyber-cyan'
              : percent >= 95
                ? 'bg-cyber-yellow'
                : 'bg-cyber-pink'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-cyber-muted w-12 text-right">
        {percent.toFixed(1)}%
      </span>
    </div>
  );
}

function SignalLost() {
  return (
    <div className="text-center py-20">
      <div className="inline-block border border-cyber-border rounded-lg p-10 bg-cyber-surface/30">
        <div className="font-heading text-2xl text-cyber-pink uppercase tracking-widest mb-3 neon-pink">
          Signal Lost
        </div>
        <p className="font-jp text-sm text-cyber-muted mb-4">信号喪失</p>
        <div className="font-mono text-xs text-cyber-muted space-y-1">
          <p>
            <span className="text-cyber-pink">ERR</span> upstream status
            endpoint unreachable
          </p>
          <p>
            <span className="text-cyber-muted">---</span> homelab monitoring is
            offline or disabled
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Homelab() {
  const [state, setState] = useState<FetchState>('loading');
  const [data, setData] = useState<StatusData | null>(null);
  const url = siteConfig.homelab.statusUrl;

  useEffect(() => {
    if (!url) {
      setState('offline');
      return;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: StatusData) => {
        setData(json);
        setState('online');
      })
      .catch(() => {
        setState('offline');
      });
  }, [url]);

  const monitors: { monitor: Monitor; up: boolean; uptime24: number }[] = [];
  if (data) {
    for (const group of data.publicGroupList) {
      for (const mon of group.monitorList) {
        const beats = data.heartbeatList[String(mon.id)] || [];
        const lastBeat = beats[beats.length - 1];
        const up = lastBeat ? lastBeat.status === 1 : false;
        const uptime24 = data.uptimeList[`${mon.id}_24`] ?? 0;
        monitors.push({ monitor: mon, up, uptime24: uptime24 * 100 });
      }
    }
  }

  return (
    <section className="py-24 px-6 glow-cyan noise-bg">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title={siteConfig.sections.homelab.title}
          jpTitle={siteConfig.sections.homelab.jp}
        />

        {state === 'loading' && (
          <div className="text-center py-16">
            <p className="font-mono text-sm text-cyber-muted animate-pulse">
              <span className="text-cyber-cyan">$</span> curl status.homelab ...
            </p>
          </div>
        )}

        {state === 'offline' && <SignalLost />}

        {state === 'online' && monitors.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-8">
              <StatusDot up={monitors.every((m) => m.up)} />
              <span className="font-mono text-xs text-cyber-muted">
                {monitors.filter((m) => m.up).length}/{monitors.length} services
                operational
              </span>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {monitors.map(({ monitor, up, uptime24 }) => (
                <motion.div key={monitor.id} variants={item}>
                  <NeonCard className="!p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <StatusDot up={up} />
                        <span className="font-body text-sm text-cyber-text">
                          {monitor.name}
                        </span>
                      </div>
                      <span
                        className={`font-mono text-[10px] ${up ? 'text-cyber-cyan' : 'text-cyber-pink'}`}
                      >
                        {up ? 'UP' : 'DOWN'}
                      </span>
                    </div>
                    <UptimeBar percent={uptime24} />
                  </NeonCard>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
