import Image from 'next/image';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import logo from '@/images/logo.svg';
import site from '@/site.config.json';

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369A19.791 19.791 0 0 0 15.432 2.85a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.249.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.369a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.027c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.105 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.1.246.198.373.292a.077.077 0 0 1-.006.128 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.106c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.029ZM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.419-2.157 2.419Z" />
    </svg>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image src={logo} alt="Colyseus" className="h-7 w-auto" priority />
          <span className="text-xs text-fd-muted-foreground">v{site.version}</span>
        </>
      ),
    },
    githubUrl: 'https://github.com/colyseus/colyseus',
    links: [
      { text: 'Roadmap', url: '/roadmap', active: 'url' },
      { text: 'Sponsors', url: '/sponsors', active: 'url' },
      {
        type: 'menu',
        text: 'Versions',
        items: [
          { text: '0.17 ↗', url: 'https://0-17.docs.colyseus.io/', external: true },
          { text: '0.16 ↗', url: 'https://0-16-x.docs.colyseus.io/', external: true },
          { text: '0.15 ↗', url: 'https://0-15-x.docs.colyseus.io/', external: true },
        ],
      },
      {
        type: 'icon',
        label: 'Discord',
        text: 'Discord',
        icon: <DiscordIcon />,
        url: 'https://chat.colyseus.io/',
        external: true,
      },
    ],
  };
}
