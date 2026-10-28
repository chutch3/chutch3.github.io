import { useEffect, useState } from 'react';

/** Strips the trailing slash so `/about/` and `/about` match the same route. */
export function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

/**
 * Current pathname, kept in sync across Astro client-side navigations.
 * Only for islands that persist between pages (e.g. the mascot).
 */
export function usePathname(): string {
  const [pathname, setPathname] = useState(() =>
    normalizePath(window.location.pathname),
  );

  useEffect(() => {
    const update = () => setPathname(normalizePath(window.location.pathname));
    document.addEventListener('astro:page-load', update);
    return () => document.removeEventListener('astro:page-load', update);
  }, []);

  return pathname;
}
