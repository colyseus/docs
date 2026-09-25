'use client';
import { useEffect, useId, useState } from 'react';
import { useTheme } from 'fumadocs-ui/provider/base';

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '');
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState('');

  useEffect(() => {
    let cancelled = false;
    void import('mermaid').then(async ({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        fontFamily: 'inherit',
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
      });
      const { svg } = await mermaid.render(`mermaid-${id}`, chart.replaceAll('\\n', '\n'));
      if (!cancelled) setSvg(svg);
    });
    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

  return <div className="my-4 flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} />;
}
