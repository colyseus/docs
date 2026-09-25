import type { ComponentProps } from 'react';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';

/**
 * Markdown images. Local ones get their size at build time and go through
 * next/image; remote ones aren't fetched at build, so they stay a plain <img>.
 */
export function Img(props: ComponentProps<'img'>) {
  if (typeof props.src === 'string' && (props.width === undefined || props.height === undefined)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ''} loading="lazy" />;
  }
  return <ImageZoom {...(props as ComponentProps<typeof ImageZoom>)} />;
}
