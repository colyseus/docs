import Image from 'next/image';
import hero from '@/images/hero.webp';

/**
 * Home page hero. It carries the wordmark and tagline, so it stands in as the
 * h1: its alt is what search engines read as the heading.
 */
export function Hero() {
  return (
    <h1 className="not-prose m-0">
      {/* priority: the hero is the LCP element, so it must not be lazy-loaded */}
      <Image src={hero} priority alt="Colyseus Multiplayer Framework" className="w-full h-auto" />
    </h1>
  );
}
