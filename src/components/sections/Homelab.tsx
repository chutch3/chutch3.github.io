import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import NeonCard from '@/components/ui/NeonCard';
import { siteConfig } from '@/config/site.config';

interface Monitor {
  id: number;
  name: string;
}

interface Heartbeat {
  status: number;
  time: string;
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

function StatusDot({ up }: { up: boolean }) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${
        up
          ? 'bg-cyber-cyan shadow-[0_0_8px_rgba(0,245,255,0.6)]'
          : 'bg-cyber-pink shadow-[0_0_8px_rgba(255,45,123,0.6)]'
      }`}
    />
  );
}

function HeartbeatTimeline({ beats }: { beats: Heartbeat[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recent = beats.slice(-50);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || recent.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const padTop = 8;
    const padBot = 4;
    const graphH = h - padTop - padBot;
    const upY = padTop;
    const downY = padTop + graphH;

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.06)';
    ctx.lineWidth = 0.5;
    for (let gy = 0; gy < 4; gy++) {
      const y = padTop + (graphH / 3) * gy;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Build points
    const points: { x: number; y: number; up: boolean }[] = recent.map(
      (beat, i) => ({
        x: (i / (recent.length - 1)) * w,
        y: beat.status === 1 ? upY : downY,
        up: beat.status === 1,
      }),
    );

    // Gradient fill under the line
    const grad = ctx.createLinearGradient(0, upY, 0, downY);
    grad.addColorStop(0, 'rgba(0, 245, 255, 0.12)');
    grad.addColorStop(1, 'rgba(0, 245, 255, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, downY);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, downY);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Glow layer (wider, more transparent)
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      if (prev.up !== curr.up) {
        ctx.lineTo(curr.x, prev.y);
      }
      ctx.lineTo(curr.x, curr.y);
    }
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Main line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      if (prev.up !== curr.up) {
        ctx.lineTo(curr.x, prev.y);
      }
      ctx.lineTo(curr.x, curr.y);
    }
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Down segments in pink
    for (let i = 0; i < points.length; i++) {
      if (!points[i].up) {
        const startX = i > 0 ? points[i - 1].x : points[i].x;
        const endX =
          i < points.length - 1
            ? (points[i + 1]?.x ?? points[i].x)
            : points[i].x;
        ctx.beginPath();
        ctx.moveTo(startX, downY);
        ctx.lineTo(endX, downY);
        ctx.strokeStyle = '#ff2d7b';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ff2d7b';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Current status dot
    const last = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = last.up ? '#00f5ff' : '#ff2d7b';
    ctx.shadowColor = last.up ? '#00f5ff' : '#ff2d7b';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [recent]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-16 rounded"
      style={{ imageRendering: 'auto' }}
    />
  );
}

function UptimeBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-cyber-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percent >= 99
              ? 'bg-cyber-cyan'
              : percent >= 95
                ? 'bg-cyber-yellow'
                : 'bg-cyber-pink'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span
        className={`font-mono text-sm font-semibold ${
          percent >= 99
            ? 'text-cyber-cyan'
            : percent >= 95
              ? 'text-cyber-yellow'
              : 'text-cyber-pink'
        }`}
      >
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

interface GitHubStatus {
  indicator: string;
  description: string;
}

export default function Homelab() {
  const [state, setState] = useState<FetchState>('loading');
  const [data, setData] = useState<StatusData | null>(null);
  const [ghStatus, setGhStatus] = useState<GitHubStatus | null>(null);
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

    fetch('https://www.githubstatus.com/api/v2/status.json')
      .then((res) => res.json())
      .then((json: { status: GitHubStatus }) => setGhStatus(json.status))
      .catch(() => {});
  }, [url]);

  const monitors: {
    monitor: Monitor;
    up: boolean;
    uptime24: number;
    beats: Heartbeat[];
  }[] = [];
  if (data) {
    for (const group of data.publicGroupList) {
      for (const mon of group.monitorList) {
        const beats = data.heartbeatList[String(mon.id)] || [];
        const lastBeat = beats[beats.length - 1];
        const up = lastBeat ? lastBeat.status === 1 : false;
        const uptime24 = (data.uptimeList[`${mon.id}_24`] ?? 0) * 100;
        monitors.push({ monitor: mon, up, uptime24, beats });
      }
    }
  }

  const allUp = monitors.length > 0 && monitors.every((m) => m.up);

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
            {/* Overall status */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 mb-10"
            >
              <StatusDot up={allUp} />
              <span className="font-heading text-sm text-cyber-text uppercase tracking-wider">
                {allUp ? 'All Systems Operational' : 'Degraded Performance'}
              </span>
              <span className="font-jp text-xs text-cyber-muted ml-1">
                {allUp ? '正常稼働中' : '一部障害'}
              </span>
            </motion.div>

            {/* Monitor cards */}
            <div className="space-y-6">
              {monitors.map(({ monitor, up, uptime24, beats }, i) => (
                <motion.div
                  key={monitor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                >
                  <NeonCard>
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StatusDot up={up} />
                          <h3 className="font-heading text-lg text-cyber-text uppercase tracking-wider">
                            {monitor.name}
                          </h3>
                        </div>
                        <span
                          className={`font-mono text-xs px-2 py-1 border rounded-sm ${
                            up
                              ? 'text-cyber-cyan border-cyber-cyan/30'
                              : 'text-cyber-pink border-cyber-pink/30'
                          }`}
                        >
                          {up ? 'OPERATIONAL' : 'DOWN'}
                        </span>
                      </div>

                      {/* 24h uptime */}
                      <div>
                        <p className="font-mono text-[10px] text-cyber-muted uppercase tracking-wider mb-2">
                          24h uptime
                        </p>
                        <UptimeBar percent={uptime24} />
                      </div>

                      {/* Heartbeat timeline */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-mono text-[10px] text-cyber-muted uppercase tracking-wider">
                            Last {beats.length} checks
                          </p>
                          <p className="font-mono text-[10px] text-cyber-muted">
                            ~{beats.length}m window
                          </p>
                        </div>
                        <HeartbeatTimeline beats={beats} />
                      </div>
                    </div>
                  </NeonCard>
                </motion.div>
              ))}
            </div>

            {/* Blurb */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-12 border border-cyber-border rounded-lg p-6 bg-cyber-surface/30"
            >
              <p className="text-sm text-cyber-text/70 leading-relaxed">
                Yes, you are looking at live metrics from my actual homelab
                sitting in my house. Because why not put a status page on a
                portfolio site? This is what being a nerd is all about.
              </p>
              {ghStatus && (
                <div className="mt-4 pt-4 border-t border-cyber-border">
                  <p className="font-mono text-[10px] text-cyber-muted mb-3">
                    this site is hosted on github pages. let's see who's keeping
                    the lights on:
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-cyber-muted">
                        my homelab:
                      </span>
                      <StatusDot up={allUp} />
                      <span
                        className={`font-mono text-xs ${allUp ? 'text-cyber-cyan' : 'text-cyber-pink'}`}
                      >
                        {allUp ? 'UP' : 'DOWN'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-cyber-muted">
                        github:
                      </span>
                      <StatusDot up={ghStatus.indicator === 'none'} />
                      <span
                        className={`font-mono text-xs ${ghStatus.indicator === 'none' ? 'text-cyber-cyan' : 'text-cyber-pink'}`}
                      >
                        {ghStatus.description.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {ghStatus.indicator !== 'none' && (
                    <p className="font-mono text-[10px] text-cyber-pink mt-2 text-right">
                      outperforming a $100B company from my closet btw
                    </p>
                  )}
                  {ghStatus.indicator === 'none' && allUp && (
                    <p className="font-mono text-[10px] text-cyber-muted mt-2 text-right">
                      rare moment: both up at the same time
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center font-mono text-[10px] text-cyber-muted mt-8"
            >
              updated every 15 min via uptime kuma → minio → tailscale funnel
            </motion.p>
          </>
        )}
      </div>
    </section>
  );
}
