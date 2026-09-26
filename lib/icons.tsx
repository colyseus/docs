import { createElement, type ElementType } from 'react';
import { icons } from 'lucide-react';
import javascript from '@/images/icons/javascript.png';
import typescript from '@/images/icons/typescript.png';
import react from '@/images/icons/react.png';
import unity from '@/images/icons/unity.png';
import defold from '@/images/icons/defold.png';
import construct3 from '@/images/icons/construct3.png';
import cocos from '@/images/icons/cocos.png';
import haxe from '@/images/icons/haxe.png';
import discord from '@/images/icons/discord.png';
import wechat from '@/images/icons/wechat.png';
import godot from '@/images/icons/godot.png';
import monogame from '@/images/icons/monogame.png';
import c from '@/images/icons/c.png';
import gamemaker from '@/images/icons/gamemaker.png';
import flutter from '@/images/icons/flutter.png';
import swift from '@/images/icons/swift.svg';
import xsolla from '@/images/icons/brands/xsolla.jpg';
import stripe from '@/images/icons/brands/stripe.jpg';
import paddle from '@/images/icons/brands/paddle.jpeg';

const logos = {
  javascript, typescript, react, unity, defold, construct3, cocos, haxe, discord, wechat,
  godot, monogame, c, gamemaker, flutter, swift, xsolla, stripe, paddle,
};

export type LogoName = keyof typeof logos;

/** Engine or brand logo, e.g. `<Logo name="unity" />` in a Card icon. */
export function Logo({ name, className = 'size-4' }: { name: LogoName; className?: string }) {
  const src = logos[name];
  if (!src) throw new Error(`Unknown logo "${name}"`);
  return <img src={src.src} alt="" className={`platform-icon ${className}`} />;
}

/**
 * Resolves the `icon` of a page (frontmatter) or folder (meta.json): a lucide
 * name (`Server`), as Fumadocs' lucideIconsPlugin does, or `logo:unity` for an
 * engine logo, which lucide doesn't carry. Unknown names fail the build.
 */
export function resolveIcon(name: string | undefined) {
  if (!name) return;
  if (name.startsWith('logo:')) return <Logo name={name.slice(5) as LogoName} />;
  const Icon = icons[name as keyof typeof icons];
  if (!Icon) throw new Error(`Unknown lucide icon "${name}"`);
  return createElement(Icon as ElementType);
}
