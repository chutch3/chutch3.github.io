declare global {
  interface Window {
    goatcounter?: {
      count: (opts: { path: string; title?: string; event?: boolean }) => void;
    };
  }
}

export function trackEvent(name: string, title?: string) {
  if (window.goatcounter) {
    window.goatcounter.count({
      path: name,
      title,
      event: true,
    });
  }
}

export function trackPageView(path: string) {
  if (window.goatcounter) {
    window.goatcounter.count({ path });
  }
}
